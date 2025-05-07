/**
 * Utility class for user-related operations
 * @class UserUtil
 */
class UserUtil {
    /**
     * Parses a full name into first and last name components
     * @param {string} name - The full name to parse
     * @returns {{firstName: string, lastName: string}} Object containing firstName and lastName
     */
    parseName(name) {
        if (!name) return { firstName: '', lastName: '' };
        const [firstName, lastName] = name.split(' ');
        return {
            firstName: firstName || '',
            lastName: lastName || ''
        };
    }
}

module.exports = new UserUtil(); 