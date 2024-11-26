export default interface SignUpRequestDto {
    id: string;
    email: string;
    password: string;
    certificationNumber: string;
    nickname: string;
    telNumber: string;
    address: string;
    addressDetail: string | null;
    agreedPersonal: boolean;
}