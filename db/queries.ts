import { db } from "@/db"
import { clubsTable, podiumsTable } from "@/db/schema"
import { unstable_cache } from "@/lib/unstable_cache"

export const getMedals = unstable_cache(
	() =>
		db.select().from(clubsTable).execute(),
	["medals"],
	{
		revalidate: 60 * 5,
		tags: ["medals"],
	}
);

export const getPodiums = unstable_cache(
	() =>
		db.select().from(podiumsTable).execute(),
	["podiums"],
	{
		revalidate: 60 * 5,
		tags: ["podiums"],
	}
);
