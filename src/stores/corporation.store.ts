import { create } from 'zustand';

interface corporationStore{
    name: string;
    introduction: string;
    contactNumber: string;
    address: string;
    addressDetail: string;
    latitude: number | null;
    longitude: number | null;
    content: string;
    corporationImageFileList: File[];
    welfare: string;
    businessLicenseFile: File | null;
    
    
    setName: (name: string) => void;
    setIntroduction: (introduction: string) => void;
    setContactNumber: (contactNumber: string) => void;
    setAddress: (address: string) => void;
    setAddressDetail: (addressDetail: string) => void;
    setLatitude: (latitude: number | null) => void;
    setLongitude: (longitude: number | null) => void;
    setContent: (content: string) => void;
    setCorporationImageFileList: (corporationImageFileList: File[]) => void;
    setWelfare: (welfare: string) => void;
    setBusinessLicenseFile: (businessLicenseFile: File | null) => void;

    resetCorporation: () => void;
    
};

const useCorporationStore = create<corporationStore>(set => ({
    name: '',
    introduction: '',
    contactNumber: '',
    address: '',
    addressDetail: '',
    latitude: null,
    longitude: null,
    content: '',
    corporationImageFileList: [],
    welfare: '',
    businessLicenseFile: null,
    
    setName: (name) => set(state => ({ ...state, name})),
    setIntroduction: (introduction) => set(state => ({ ...state, introduction})),
    setContactNumber: (contactNumber) => set(state => ({ ...state, contactNumber})),
    setAddress: (address) => set(state => ({...state, address})),
    setAddressDetail: (addressDetail) => set(state => ({...state, addressDetail})),
    setLatitude: (latitude) => set(state => ({ ...state, latitude})),
    setLongitude: (longitude) => set(state => ({ ...state, longitude})),
    setContent: (content) => set(state => ({ ...state, content})),
    setCorporationImageFileList: (corporationImageFileList) => set(state => ({...state, corporationImageFileList})),
    setWelfare: (welfare) => set(state => ({ ...state, welfare})),
    setBusinessLicenseFile: (businessLicenseFile) => set(state => ({ ...state, businessLicenseFile})),

    resetCorporation: () => set(state => ({ ...state, 
        name: '',
        introduction: '',
        contactNumber: '',
        address: '',
        addressDetail: '',
        latitude: null,
        longitude: null,
        content: '',
        corporationImageFileList: [],
        welfare: '',
        businessLicenseFile: null,
    }))
    
    
}))

export default useCorporationStore;
