import z from 'zod'

const userSchema = z.object({
    user_fullname: z.string({
        invalid_type_error: 'Username must be a string',
        required_error: 'Username is required'
    }),
    email: z.string().email({
        message: 'Invalid format of email'
    }),
    phone: z.string({
        invalid_type_error: 'Incorrect format',
        required_error: 'Phone number is required'
    }).min(11, {
        message: 'Min 10 characters'
    }),
    birthday: z.string().refine((date) => {
        const regex = /^\d{2}\/\d{2}\/\d{4}$/;
        if (!regex.test(date)) return false;
    
        const [day, month, year] = date.split('/').map(Number);
        const isoDate = new Date(`${year}-${month}-${day}`);
    
        // Check if the date is valid
        return isoDate.getFullYear() === year && isoDate.getMonth() + 1 === month && isoDate.getDate() === day;
    }, {
        message: "Invalid date format. Expected format is DD/MM/YYYY"
    }).transform((date) => {
        const [day, month, year] = date.split('/').map(Number);
        return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    }),
    question: z.string({
        invalid_type_error: 'Security Question must be a string',
        required_error: 'Security Question is required'
    }),
    answer: z.string({
        invalid_type_error: 'Security Answer must be a string',
        required_error: 'Security Answer is required'
    })
})

export function validateUser(object) {
    return userSchema.safeParse(object)
}

export function validatePartialUser(object) {
    return userSchema.partial().safeParse(object)
}