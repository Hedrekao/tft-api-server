import bcrypt from 'bcrypt';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
const register = async (dto) => {
    if (!verifyPassword(dto.password)) {
        throw new Error('Invalid password');
    }
    const encryptedPassword = await bcrypt.hash(dto.password, 10);
    const user = await prisma.users.create({
        data: {
            email: dto.email,
            password: encryptedPassword,
            userName: dto.userName == undefined ? null : dto.userName,
            summonerName: dto.summonerName == undefined ? null : dto.summonerName,
            region: dto.region == undefined ? null : dto.region
        }
    });
    return true;
};
const verifyPassword = (password) => {
    return password.length >= 8;
};
export default register;
