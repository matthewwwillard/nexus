export class NotificationHelper
{
    public static types = {
        PLATFORM:1,
        BRAND:2,
        FRANCHISE:3,
        USER:5
    };

    public static getType(id)
    {
        for(let i in NotificationHelper.types) {
            if (NotificationHelper.types[i] == id) {
                return i;
            }
        }
    }
}