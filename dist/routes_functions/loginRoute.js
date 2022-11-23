import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
const prisma = new PrismaClient();
const login = async (dto) => {
    const user = await prisma.users.findFirst({ where: { email: dto.email } });
    if (user == null) {
        throw new Error('No user with such email');
    }
    if (!(await bcrypt.compare(dto.password, user.password))) {
        throw new Error('Password mismatch');
    }
    const token = jwt.sign({ email: user.email }, process.env.JWT_SECRET_KEY, {});
    return token;
};
export default login;
