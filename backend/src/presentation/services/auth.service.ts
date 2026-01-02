import { User } from "../../data/postgres/entities";
import { CustomError, LoginUserDto, RegisterUserDto, UserEntity } from "../../domain";
import { bcryptAdapter, jwtAdapter } from "../../config";


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
                password: bcryptAdapter.hash(registerUserDto.password),
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

    public async loginUser(loginUserDto: LoginUserDto) {
        const user = await User.findOne({ where: { email: loginUserDto.email } });
        if (!user) throw CustomError.badRequest('Email no existe');

        const isMatching = bcryptAdapter.compare(loginUserDto.password, user.password);
        if (!isMatching) throw CustomError.badRequest('Contraseña incorrecta');

        const {password, ...userEntity } = UserEntity.fromObject(user);

        const token = await jwtAdapter.generateToken({ id: user.id });
        if ( !token ) throw CustomError.internalServer('Error en la creación del JWT');

        return {
            user: userEntity,
            token: token,
        };
    }
}