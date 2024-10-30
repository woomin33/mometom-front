export default interface CorporationListItem{
    corporationNumber: number;
    name: string;
    introduction: string;
    address: string;
    addressDetail: string;
    latitude: number ;
    longitude: number ;
    noticeNumber: number | null;
    categoryNumber: number;
    firstImage: string;
    endDate: string;
    approval: number | null;

}

