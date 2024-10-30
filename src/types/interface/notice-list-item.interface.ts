export default interface NoticeListItem{
    noticeNumber : number;      
    title : string | null;
    endDate : string | null;
    registrationDate : string | null;
    applicationCount : number;
    corporationNumber : number;
    devCategoryNumber : number;
    devCategoryName : string | null;
    corporationName : string | null;
    corporationImage : string | null;
    techniques : string | null;
}