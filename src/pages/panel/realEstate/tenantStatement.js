import React, { useEffect, useState } from 'react'
import FullLayout from '@/panel/layouts/FullLayout';
import { useSearchParams } from 'next/navigation';
import { useRouter } from 'next/router';
import { ProSidebarProvider } from 'react-pro-sidebar';
import { ToastContainer } from 'react-toastify';
import { FiUsers } from 'react-icons/fi';
import { Card, CardBody, Accordion, AccordionHeader, AccordionBody, Tabs, TabsHeader, TabsBody, Tab, TabPanel} from "@material-tailwind/react";
import mongoose from "mongoose";
import ContractAndTenant from 'models/ContractAndTenant';
import moment from 'moment/moment';
import ChequeTransaction from 'models/ChequeTransaction';
import Cheque from 'models/Cheque';


function Icon({ id, open }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={2}
      stroke="currentColor"
      className={`${id === open ? "rotate-180" : ""} h-5 w-5 transition-transform`}
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
    </svg>
  );
}

const TenantStatement = ({ dbContracts, dbChequeTrx, dbCheques }) => {

  const router = useRouter();
  const searchParams = useSearchParams()
  const tenantId = searchParams.get('id')

  const [openTenantExtraForm, setOpenTenantExtraForm] = React.useState(1);
  const handleOpenTenantExtraForm = (value) => setOpenTenantExtraForm(openTenantExtraForm === value ? 0 : value);

  const [selectedIds, setSelectedIds] = useState([]);

  const [tenantName, setTenantName] = useState('')
  const [tenantEmail, setTenantEmail] = useState('')
  const [buildingNameInEnglish, setBuildingNameInEnglish] = useState('')
  const [unitNo, setUnitNo] = useState('')
  const [tenantPhoneNo, setTenantPhoneNo] = useState('')

  const [filteredContracts, setFilteredContracts] = useState([])
  const [filteredTrx, setFilteredTrx] = useState([])


  function handleRowCheckboxChange(e, id) {

    const isChecked = selectedIds.includes(id);

    if (isChecked) {
      setSelectedIds(selectedIds.filter(rowId => rowId !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  }
  
  useEffect(() => {

    let headingData = dbContracts.filter((item)=> item._id === tenantId)

    if(headingData.length > 0) {
      setTenantEmail(headingData[0].tenantEmail)
      setBuildingNameInEnglish(headingData[0].buildingNameInEnglish)
      setUnitNo(headingData[0].unitNo)
      setTenantPhoneNo(headingData[0].tenantPhoneNo)
      setTenantName(headingData[0].tenantName)
    }

    let filteredContracts = dbContracts.filter((item)=> item.tenantEmail === headingData[0].tenantEmail)
    setFilteredContracts(filteredContracts)
    
    // let filteredTrx = dbChequeTrx.filter((item)=> {
    //   if(item.email === headingData[0].tenantEmail){

    //     let chqId = item.chequeId;
        
    //     let chqData = dbCheques.filter((newItem)=>{
    //       if(newItem._id === chqId){
    //         return newItem;
    //       }
    //     })

    //   }
    // })


    let filteredTrx = dbChequeTrx
    .filter((item) => item.email === headingData[0].tenantEmail)
      .map((item) => {
      let chqId = item.chequeId;

      // Use find instead of filter to get a single matching chqData
      let chqData = dbCheques.find((newItem) => newItem._id === chqId);

      // Combine item and chqData into a single object
      return {
        ...item, // Include all properties from item
        chqData: chqData, // Add chqData as a new property
      };
    });

    setFilteredTrx(filteredTrx)

  }, [tenantId])


  const newContractData = [
      
    {
      label: "Contracts",
      value: "contracts",
      icon: FiUsers,
      desc: (
        <div className=''>

          <div className="overflow-hidden shadow sm:rounded-md">
            
            <div className="overflow-x-auto shadow-sm">
              <table className="w-full text-sm text-left text-gray-500 ">
                <thead className="text-[11px] text-gray-700 uppercase bg-[#f2f4f5]">
                  <tr className=''>
                    <th scope="col" className="p-4">
                      <div className="flex items-center">
                        <input id="checkbox-all-search" type="checkbox" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"/>
                      </div>
                    </th>
                    <th scope="col" className="p-1">
                        Contract Start Date
                    </th>
                    <th scope="col" className="p-1">
                        Contract End Date
                    </th>
                    <th scope="col" className="p-1">
                        Unit Rent
                    </th>
                    <th scope="col" className="p-1">
                        Rent Parking
                    </th>
                    <th scope="col" className="pr-3">
                        Contract Status
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredContracts.map((item, index)=>{
                  return <tr key={index} className="text-[13px] bg-white border-b hover:bg-gray-50">
                    <td className="w-4 p-4">
                      <div className="flex items-center">
                        <input id={`checkbox-table-search-${item._id}`} checked={selectedIds.includes(item._id)} type="checkbox" onChange={e => handleRowCheckboxChange(e, item._id)} className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"/>
                      </div>
                    </td>
                    <td className="p-1 w-[100px]">
                      {moment(item.newContractStartDate).utc().format('D MMM YYYY')}
                    </td>
                    <td className="p-1 w-[90px]">
                      {moment(item.newContractEndDate).utc().format('D MMM YYYY')}
                    </td>
                    <td className="p-1 w-[100px]">
                      {(item.newContractUnitRent).toLocaleString()}
                    </td>
                    <td className="p-1 w-[100px]">
                      {(item.newContractRentParking).toLocaleString()}
                    </td>
                    <td className="p-1 w-[100px]">
                      {item.newContractStatus}
                    </td>
                  </tr>})}
                  
                </tbody>
              </table>
              { filteredContracts.length === 0  ? <h1 className='text-red-600 text-center text-base my-3'>No data found!</h1> : ''}
            </div>

          </div>
        </div>
      ),
    },
    {
      label: "Account",
      value: "account",
      icon: FiUsers,
      desc: (
        <div>
          <div className="overflow-hidden shadow sm:rounded-md">
            <div className="overflow-x-auto shadow-sm">
              <table className="w-full text-sm text-left text-gray-500 ">
                <thead className="text-[11px] text-gray-700 uppercase bg-[#f2f4f5]">
                  <tr className=''>
                    <th scope="col" className="p-4"></th>
                    <th scope="col" className="p-1">
                      Trx Type
                    </th>
                    <th scope="col" className="p-1">
                      Trx No
                    </th>
                    <th scope="col" className="p-1">
                      Description
                    </th>
                    <th scope="col" className="p-1">
                      Date
                    </th>
                    <th scope="col" className="p-1 w-32">
                      Financial Dues
                    </th>
                    <th scope="col" className="p-1">
                      Payments
                    </th>
                    <th scope="col" className="p-1">
                      Balance
                    </th>
                    <th scope="col" className="pr-3">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTrx.map((item, index)=>{
                    console.log(item)
                  return <tr key={index} className="text-[13px] bg-white border-b hover:bg-gray-50">
                    <td className="w-4 p-4"></td>
                    <td className="p-1 w-[100px]">
                      {item.path}
                    </td>
                    <td className="p-1 w-[90px]">
                      {item.journalNo}
                    </td>
                    <td className="p-1 w-[100px]">
                      {item.desc}
                    </td>
                    <td className="p-1 w-[100px]">
                      {moment(item.journalDate).utc().format('D MMM YYYY')}
                    </td>
                    <td className="p-1 w-[100px]">
                      {item.financialDues || ''}
                    </td>
                    <td className="p-1 w-[100px]">
                      {item.type === 'JV' ? (item.totalDebit).toLocaleString() : ''}
                    </td>
                    <td className="p-1 w-[100px]">
                      {item.balance || ''}
                    </td>
                    <td className="p-1 w-[100px]">
                      {item.chqData.chequeStatus}
                    </td>
                  </tr>})}
                  
                </tbody>
              </table>
              { filteredTrx.length === 0  ? <h1 className='text-red-600 text-center text-base my-3'>No data found!</h1> : ''}
            </div>
          </div>

        </div>
      ),
    },
    {
      label: "Profile Information",
      value: "profileInfo",
      icon: FiUsers,
      desc: (
        <div>
          <div className="bg-white py-5">
            <div className="grid grid-cols-6 gap-6">

              <div className="col-span-6 sm:col-span-1">
                <label htmlFor="tenantName" className="block text-sm font-medium text-gray-700">Name:</label>
                <input disabled type="tenantName" name="tenantName" id="tenantName" className="cursor-not-allowed mt-1 p-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"/>
              </div>


              <div className="col-span-6 sm:col-span-1">
                <label htmlFor="tenantEmail" className="block text-sm font-medium text-gray-700">Email address</label>
                <input disabled type="text" name="tenantEmail" id="tenantEmail" autoComplete="email" className="cursor-not-allowed mt-1 p-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"/>
              </div>

              <div className="col-span-6 sm:col-span-1">
                <label htmlFor="tenantPhoneNo" className="block text-sm font-medium text-gray-700">Phone Number</label>
                <input disabled type="number" name="tenantPhoneNo" id="tenantPhoneNo" className="cursor-not-allowed mt-1 p-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"/>
              </div>

              <div className="col-span-6 sm:col-span-1">
                <label htmlFor="tenantOpeningBalance" className="block text-sm font-medium text-gray-700">Opening Balance</label>
                <input disabled type="number" name="tenantOpeningBalance" id="tenantOpeningBalance" className="cursor-not-allowed mt-1 p-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"/>
              </div>

              <div className="col-span-6 sm:col-span-1">
                <label htmlFor="tenantIdNumber" className="block text-sm font-medium text-gray-700">Id Personal Number</label>
                <input type="number" name="tenantIdNumber" id="tenantIdNumber" className="mt-1 p-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"/>
              </div>

              <div className="col-span-6 sm:col-span-1">
                <label htmlFor="tenantExpIdNumber" className="block text-sm font-medium text-gray-700">Expiry Date Id Number</label>
                <input type="date" name="tenantExpIdNumber" id="tenantExpIdNumber" className="mt-1 p-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"/>
              </div>

            </div>

          </div>
          <Accordion open={openTenantExtraForm === 0} icon={<Icon id={1} open={openTenantExtraForm} />}>
            <AccordionHeader onClick={() => handleOpenTenantExtraForm(1)}>Add More? Then click!</AccordionHeader>
            <AccordionBody>
              <div>
                <div className='flex space-x-4 mb-14'>

                  <div className="w-full">
                    <label htmlFor="tenantPassPortNumber" className="block text-sm font-medium text-gray-700">
                      Passport Number
                    </label>
                    <input
                      type="number"
                      name="tenantPassPortNumber"
                      id="tenantPassPortNumber"
                      className="mt-1 p-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    />
                  </div>

                  <div className="w-full">
                    <label htmlFor="tenantExpPassPort" className="block text-sm font-medium text-gray-700">
                      Expiry Date Passport
                    </label>
                    <input 
                      type="date"
                      name="tenantExpPassPort"
                      id="tenantExpPassPort"
                      className="mt-1 p-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    />
                  </div>

                  <div className="w-full">
                    <label htmlFor="tenantVatRegistrationNo" className="block text-sm font-medium text-gray-700">
                      Vat Registration No
                    </label>
                    <input 
                      type="number"
                      name="tenantVatRegistrationNo"
                      id="tenantVatRegistrationNo"
                      className="mt-1 p-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    />
                  </div> 
                </div>

                <div className='flex space-x-4 mb-14'>
                  <div className="w-full">
                    <label htmlFor="tenantIbanNo" className="block text-sm font-medium text-gray-700">
                      IBAN Number
                    </label>
                    <input
                      type="number"
                      name="tenantIbanNo"
                      id="tenantIbanNo"
                      className="mt-1 p-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    />
                  </div>

                  <div className="w-full">
                    <label htmlFor="tenantBank" className="block text-sm font-medium text-gray-700">
                      The Bank
                    </label>
                    <input 
                      type="text"
                      name="tenantBank"
                      id="tenantBank"
                      className="mt-1 p-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    />
                  </div>

                  <div className="w-full">
                    <label htmlFor="tenantBankAccountNumber" className="block text-sm font-medium text-gray-700">
                      Bank Account Number
                    </label>
                    <input 
                      type="number"
                      name="tenantBankAccountNumber"
                      id="tenantBankAccountNumber"
                      className="mt-1 p-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    />
                  </div>
                  
                </div>
              </div>
              
            </AccordionBody>
          </Accordion>

        </div>
      ),
    },
  ];
  

  return (
    
  <>
  <ProSidebarProvider>
  <style jsx global>{`
    footer {
      display: none;
    }
    header {
      display: none;
    }
  `}</style>
  <FullLayout>
  {/* React tostify */}
  <ToastContainer position="bottom-center" autoClose={1000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover theme="light"/>

  <div className="mt-10 sm:mt-0">
    <div className="md:grid md:grid-cols-1 md:gap-6">
      <div className="md:col-span-1">
        <div className="px-4 sm:px-0 flex">
          <h3 className="text-lg font-semibold leading-6 text-gray-900">Tenant Account Statement</h3>
        </div>
      </div>
      <div className="mt-2 md:col-span-2 md:mt-0">

        <Card className="w-full">
          <CardBody>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="mb-4 h-12 w-12 text-blue-800"
            >
              <path
                fillRule="evenodd"
                d="M9.315 7.584C12.195 3.883 16.695 1.5 21.75 1.5a.75.75 0 01.75.75c0 5.056-2.383 9.555-6.084 12.436A6.75 6.75 0 019.75 22.5a.75.75 0 01-.75-.75v-4.131A15.838 15.838 0 016.382 15H2.25a.75.75 0 01-.75-.75 6.75 6.75 0 017.815-6.666zM15 6.75a2.25 2.25 0 100 4.5 2.25 2.25 0 000-4.5z"
                clipRule="evenodd"
              />
              <path d="M5.26 17.242a.75.75 0 10-.897-1.203 5.243 5.243 0 00-2.05 5.022.75.75 0 00.625.627 5.243 5.243 0 005.022-2.051.75.75 0 10-1.202-.897 3.744 3.744 0 01-3.008 1.51c0-1.23.592-2.323 1.51-3.008z" />
            </svg>

            <div className='flex w-full'>
              <div className='flex flex-col space-y-8 w-3/5'>

                <div className='w-full flex space-x-4'>
                  <div className="w-full">
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                      Name:
                    </label>
                    <input 
                      type="text"
                      name="name"
                      value={tenantName}
                      id="name"
                      className="mt-1 p-2 block w-full rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                      readOnly
                    />
                  </div>
                  <div className="w-full">
                    <label htmlFor="building" className="block text-sm font-medium text-gray-700">
                      Building:
                    </label>
                    <input
                      type="text"
                      name="building"
                      value={buildingNameInEnglish}
                      id="building"
                      className="mt-1 p-2 block w-full rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                      readOnly
                    />
                  </div>
                </div>
                <div className='w-full flex space-x-4'>
                  <div className="w-1/2">
                    <label htmlFor="unitNo" className="block text-sm font-medium text-gray-700">
                      Unit No:
                    </label>
                    <input 
                      type="number"
                      name="unitNo"
                      value={unitNo}
                      id="unitNo"
                      className="mt-1 p-2 block w-full rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                      readOnly
                    />
                  </div>
                  <div className="w-full">
                    <label htmlFor="phoneNo" className="block text-sm font-medium text-gray-700">
                      Phone No:
                    </label>
                    <input
                      type="number"
                      name="phoneNo"
                      value={tenantPhoneNo}
                      id="phoneNo"
                      className="mt-1 p-2 block w-full rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                      readOnly
                    />
                  </div>
                  <div className="w-full">
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                      Email:
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={tenantEmail}
                      id="email"
                      className="mt-1 p-2 block w-full rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                      readOnly
                    />
                  </div>
                </div>
                
              </div>
              <div className='w-2/5 flex justify-center'>
                <img
                  className="h-44 w-44 rounded-full object-cover object-center"
                  src="https://images.unsplash.com/photo-1682407186023-12c70a4a35e0?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2832&q=80"
                  alt="nature image"
                />
              </div>
            </div>
            
          </CardBody>
        </Card>

        <Card className="w-full mt-4">
          <CardBody>
            <div className='flex w-full'>
              <Tabs value="contracts" className='w-full'>
                <TabsHeader className='bg-[#f0f3f4]'>
                  {newContractData.map(({ label, value, icon }) => (
                    <Tab key={value} value={value}>
                      <div className="flex items-center gap-2">
                        {React.createElement(icon, { className: "w-5 h-5" })}
                        {label}
                      </div>
                    </Tab>
                  ))}
                </TabsHeader>
                <TabsBody className='w-full'>
                  {newContractData.map(({ value, desc }) => (
                    <TabPanel key={value} value={value} className='p-0'>
                      {desc}
                    </TabPanel>
                  ))}
                </TabsBody>
              </Tabs>
            </div>
          </CardBody>
        </Card>
        
      </div>
    </div>
  </div>

  </FullLayout>
  </ProSidebarProvider>
  </>
  )
}


export async function getServerSideProps() {
  if (!mongoose.connections[0].readyState){
    mongoose.set("strictQuery", false);
    await mongoose.connect(process.env.MONGO_URI)
  }
  let dbContracts = await ContractAndTenant.find()
  let dbChequeTrx = await ChequeTransaction.find()
  let dbCheques = await Cheque.find()

  // Pass data to the page via props
  return {
    props: {
      dbContracts: JSON.parse(JSON.stringify(dbContracts)),
      dbChequeTrx: JSON.parse(JSON.stringify(dbChequeTrx)),
      dbCheques: JSON.parse(JSON.stringify(dbCheques)),
    }
  }
}   

export default TenantStatement