import validator from 'validator';

export const validateUser = (req, res, next) => {
    const { userName, email, password, mobile } = req.body;

    if (!userName.trim()) {
        return res.status(400).json({ message: 'Username is required' });
    }

    if (!validator.isEmail(email)) {
        return res.status(400).json({ message: 'Invalid email format' });
    }

    if (!validator.isMobilePhone(mobile, 'en-IN')) {
        return res.status(400).json({ message: 'Invalid phone number format' });
    }

    if (!validator.isLength(password, { min: 8 })) {
        return res.status(400).json({ message: 'Password must be at least 8 characters long.' });
    }
    if (!/[a-z]/.test(password)) {
        return res.status(400).json({ message: 'Password must contain at least one lowercase letter.' });
    }
    if (!/[A-Z]/.test(password)) {
        return res.status(400).json({ message: 'Password must contain at least one uppercase letter.' });
    }
    if (!/[0-9]/.test(password)) {
        return res.status(400).json({ message: 'Password must contain at least one number.' });
    }
    if (!/[\W_]/.test(password)) {
        return res.status(400).json({ message: 'Password must contain at least one special character.' });
    }

    next();
};


export const validateLogin = (req, res, next) => {
    const { email, password } = req.body;

    if (!email || !validator.isEmail(email)) {
        return res.status(400).json({ message: 'Invalid email format' });
    }

    if (!password || password.length < 8) {
        return res.status(400).json({ message: 'Password must be at least 8 characters long' });
    }

    next();
};
