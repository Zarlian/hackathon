"use server";
import { redirect } from "@solidjs/router";
import { useSession } from "vinxi/http";
import { and, desc, eq } from "drizzle-orm";
import { db } from "./db";
import { Argon2id } from "oslo/password";
import { Challenges, UserChallenges, Users } from "../../drizzle/schema";
const argon2id = new Argon2id();
function validateUsername(username: unknown) {
  if (typeof username !== "string" || username.length < 3) {
    return `Usernames must be at least 3 characters long`;
  }
}
function validatePassword(password: unknown) {
  if (typeof password !== "string" || password.length < 6) {
    return `Passwords must be at least 6 characters long`;
  }
}
async function login(username: string, password: string) {
  const user = db.select().from(Users).where(eq(Users.username, username))
    .get();
  if (!user) throw new Error("User not found");
  const passwordCorrect = await argon2id.verify(user.password, password);
  if (!passwordCorrect) throw new Error("Invalid login credentials");
  return user;
}
async function register(username: string, password: string) {
  const existingUser = db.select().from(Users).where(
    eq(Users.username, username),
  ).get();
  if (existingUser) throw new Error("User already exists");
  const hashedPassword = await argon2id.hash(password);
  return db.insert(Users).values({ username, password: hashedPassword })
    .returning().get();
}
function getSession() {
  return useSession({
    password: process.env.SESSION_SECRET ??
      "areallylongsecretthatyoushouldreplace",
  });
}
export async function loginOrRegister(formData: FormData) {
  const username = String(formData.get("username"));
  const password = String(formData.get("password"));
  const loginType = String(formData.get("loginType"));
  let error = validateUsername(username) || validatePassword(password);
  if (error) return new Error(error);
  try {
    const user = await (loginType !== "login"
      ? register(username, password)
      : login(username, password));
    const session = await getSession();
    await session.update((d) => {
      d.userId = user.id;
    });
  } catch (err) {
    return err as Error;
  }
  throw redirect("/");
}
export async function logout() {
  const session = await getSession();
  await session.update((d) => (d.userId = undefined));
  throw redirect("/login");
}
async function getUserId() {
  const session = await getSession();
  return session.data.userId;
}
export async function getUser() {
  const userId = await getUserId();
  if (userId === undefined) throw redirect("/login");
  try {
    const user = db.select().from(Users).where(eq(Users.id, userId)).get();
    if (!user) throw redirect("/login");
    return { id: user.id, username: user.username };
  } catch {
    throw logout();
  }
}
export async function getChallenges() {
  return db.select().from(Challenges).all();
}
export async function getChallenge(challengeId: number) {
  const user = await getUser();
  const result = await db.select({
    challengeId: Challenges.id,
    challengeName: Challenges.name,
    challengeDescription: Challenges.description,
    userChallengeId: UserChallenges.challengeId,
    score: UserChallenges.score,
  }).from(Challenges).leftJoin(
    UserChallenges,
    and(
      eq(Challenges.id, UserChallenges.challengeId),
      eq(UserChallenges.userId, user.id),
    ),
  ).where(eq(Challenges.id, challengeId)).limit(1);
  return result[0];
}
export async function upsertUserChallenge(challengeId: number, score: number) {
  const userId = await getUserId();
  const challenge = await getChallenge(challengeId);
  const currentScore = challenge?.score ?? 0;
  if (score <= currentScore) return { scoreUpdated: false };
  await db.insert(UserChallenges).values({ userId: userId, challengeId, score })
    .onConflictDoUpdate({
      target: [UserChallenges.userId, UserChallenges.challengeId],
      set: { score },
    });
  return { scoreUpdated: true };
}
export async function getLeaderboard(challengeId: number) {
  return db.select({ username: Users.username, score: UserChallenges.score })
    .from(Users).innerJoin(UserChallenges, eq(Users.id, UserChallenges.userId))
    .where(eq(UserChallenges.challengeId, challengeId)).orderBy(
      desc(UserChallenges.score),
    ).limit(10).all();
}
