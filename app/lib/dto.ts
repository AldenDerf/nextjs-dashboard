// DATA TRANSFER OBJECTS (DTO)
import 'server-only';
import { getUser } from './dal';
import { User } from './definitions';

function canSeeUsername(viewer: User) {
    return true
}

function canSeePhoneNumber(viewer: User, team: string) {
    return viewer.isAdmin || team === viewer.team
}

export async function getProfileDTO(slug: string) {
    const data = await db.query.users.findMany({
        where: equal(users.slug, slug),
        // Return specific columns here
    })

    const currentUser = await getUser(userAgent.id)

    // Or return only what's specific to the query here
    return {
        username: canSeeUsername(currentUser) ? username: null,
        phonenumber: canSeePhoneNumber(currentUser, user.team)
        ? user.phonenumber
        : null,
    }
}

