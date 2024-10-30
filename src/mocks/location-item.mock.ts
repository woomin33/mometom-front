import { CorporationListItem } from 'types/interface';
import testImage from './corporation-test.png';
import t1 from './1.png';
import t2 from './2.png';
import t3 from './3.jpg';
import t4 from './4.jpg';


const EmployItemMock: CorporationListItem[] = [
    {    
        corporationNumber: 1,
        name: '테스트1',
        introduction: '테스트1입니다',
        address: '경기도 안산시 단원구 와개길 52',
        addressDetail: '102호',
        latitude: 1,
        longitude: 1,
        noticeNumber: null,
        categoryNumber: 7,
        firstImage: t1,
        endDate: '',
        approval: 0
    },
    {    
        corporationNumber: 2,
        name: '테스트2',
        introduction: '테스트2입니다',
        address: '경기도 안산시 단원구 와개길 51',
        addressDetail: '102호',
        latitude: 2,
        longitude: 2,
        noticeNumber: null,
        categoryNumber: 7,
        firstImage: t2,
        endDate: '',
        approval: 0
    }
    
]

export default EmployItemMock;