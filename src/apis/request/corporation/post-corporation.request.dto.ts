export default interface PostCorporationRequestDto{
    name: string;
    introduction: string;
    content: string;
    address: string;
    addressDetail: string;
    latitude: number;
    longitude: number;
    welfare: string | null;
    businessLicense: string;
    contactNumber: string;
    corporationImageList: string[];
}
