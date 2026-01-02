import { User } from "../../data/postgres/entities";
import { CustomError, RegisterUserDto, UserEntity } from "../../domain";


export class AuthService {

    //DI
    constructor(){}

    public async registerUser(registerUserDto: RegisterUserDto ) {
        const existUser = await User.findOne({ where: { email: registerUserDto.email } });
        if ( existUser ) throw CustomError.badRequest('El correo electrónico ya está registrado');

        try{
            const user = User.create({
                name: registerUserDto.name,
                email: registerUserDto.email,
                password: registerUserDto.password,
            });

            await user.save();

            const {password, ...userEntity } = UserEntity.fromObject(user);

            return {
                user: userEntity,
                token: 'token',
            };

        } catch (error) {
            throw CustomError.internalServer(`${ error }`);
        }
    }
}