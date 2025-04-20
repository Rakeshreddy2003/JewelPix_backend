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


    next();
};


export const validateLogin = (req, res, next) => {
    const { email,} = req.body;

    if (!email || !validator.isEmail(email)) {
        return res.status(400).json({ message: 'Invalid email format' });
    }

    next();
};
