import type PocketBase from "pocketbase";
import type { Safe } from "../safe.service";

export type Course = {
    id: string;
    userId: string;
    name: string;
};

export async function getAllCoursesByUserId(
    pb: PocketBase,
    userId: string,
): Promise<Safe<Course[]>> {
    try {
        const rounds: Course[] = await pb.collection("courses").getFullList<Course>({
            filter: `userId = "${userId}"`,
        });
        const pojo = rounds.map((el) => ({
            id: el.id,
            userId: el.userId,
            name: el.name,
        }));
        return { data: pojo, success: true };
    } catch (e) {
        console.error(e);
        return { error: "Failed to load data", success: false };
    }
}

export async function createCourse(
    pb: PocketBase,
    userId: string,
    name: string,
): Promise<Safe<Course>> {
    try {
        const course = await pb.collection("courses").create<Course>({
            userId,
            name,
        });
        const data = {
            id: course.id,
            userId: course.userId,
            name: course.name,
        };
        return { data, success: true };
    } catch (e) {
        console.error(e);
        return { error: "Failed to insert data", success: false };
    }
}
