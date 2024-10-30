export default interface Corporation{
    corporationNumber: number;
    name: string;
    introduction: string;
    content: string;
    registrationDateTime: string;
    registerEmail: string;
    address: string;
    addressDetail: string;
    latitude: number;
    longitude: number;
    welfare: string;
    businessLicense: string;
    contactNumber: string;
    corporationImageList: string[];
    approval: boolean;
}
