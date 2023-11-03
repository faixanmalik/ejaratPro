import React, {Fragment, useEffect, useRef, useState} from 'react'
import mongoose from "mongoose";
import moment from 'moment/moment';
import { XMarkIcon } from '@heroicons/react/24/outline'
import { Menu, Dialog, Transition } from '@headlessui/react'
import { ChevronDownIcon } from '@heroicons/react/20/solid'
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { AiOutlineDelete, AiOutlineEdit, AiOutlinePlusCircle, AiOutlinePrinter } from 'react-icons/ai';
import { ProSidebarProvider } from 'react-pro-sidebar';
import FullLayout from '@/panel/layouts/FullLayout';
import Employees from 'models/Employees';
import ReactToPrint from 'react-to-print';
import { useRouter } from 'next/router';
import { useSearchParams } from 'next/navigation'
import Link from 'next/link';
import ContractAndTenant from 'models/ContractAndTenant';


import { HiOutlineBuildingOffice2 } from 'react-icons/hi2';
import { BiUserCircle } from 'react-icons/bi';
import { BsCashCoin } from 'react-icons/bs';
import { FiUsers } from 'react-icons/fi';
import { MdAccountBox } from 'react-icons/md';


import {
  Tabs,
  TabsHeader,
  TabsBody,
  Tab,
  TabPanel,
  Typography,
  Select, 
  Option,
  IconButton,
  Accordion,
  AccordionHeader,
  AccordionBody,
} from "@material-tailwind/react";
import Contact from 'models/Contact';
import Product from 'models/Product';

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


const ContractTermination = ({ dbProducts, dbTenants, dbContracts, dbContacts}) => {

  const router = useRouter();
  const searchParams = useSearchParams()
  const open = searchParams.get('open')
  const contractId = searchParams.get('contractId')


  const [inputList, setInputList] = useState([
    { products:'', amount:'', accruedRent:'', refund: '', totalAmountPerItem:'' },
    { products:'', amount:'', accruedRent:'', refund: '', totalAmountPerItem:'' },
    { products:'', amount:'', accruedRent:'', refund: '', totalAmountPerItem:'' },
  ]);

  const [totalDays, setTotalDays] = useState(0)

  const [contractStartDate, setContractStartDate] = useState('')
  const [contractEndDate, setContractEndDate] = useState('')
  

  useEffect(() => {

    if(contractId){

      let filterContractData = dbContracts.filter((item)=>{
        return item._id === contractId;
      })
      
    
      const { tenantName, buildingNameInEnglish, newContractUnitRent, newContractRentParking, newContractSecurityDeposit, unitNo, newContractStartDate, newContractEndDate } = filterContractData[0]
      
      let contractStartDate = moment(newContractStartDate).utc().format('YYYY-MM-DD')
      // let newContractEndDate = moment(newContractEndDate).utc().format('YYYY-MM-DD')

      if(contractEndDate){
        setContractEndDate(contractEndDate)
      }
      else{
        let momentContractEndDate = moment(newContractEndDate).utc().format('YYYY-MM-DD')
        setContractEndDate(momentContractEndDate)
      }
      
      let startDate = new Date(contractStartDate);
      let endDate = new Date(contractEndDate);
      let timeDifference = endDate.getTime() - startDate.getTime();
      let daysDifference = timeDifference / (1000 * 60 * 60 * 24) + 1;
      setTotalDays(daysDifference)

      setContractStartDate(contractStartDate)

      setTenant(tenantName)
      setBuildingNameInEnglish(buildingNameInEnglish)
      setUnitNo(unitNo)
      

      let referData = [
        { name: 'Unit Rent', index: 0, amount: newContractUnitRent},
        { name: 'Parking Rent', index: 1, amount: newContractRentParking},
        { name: 'Security Deposit', index: 2, amount: newContractSecurityDeposit},
      ]

      let updatedInputList = inputList.map((item, index) => {
        const matchingItem = referData.find((referItem) => referItem.index === index);

        if (matchingItem) {
          return {
            ...item,
            amount: matchingItem.amount,
            products: matchingItem.name,
            totalAmountPerItem: matchingItem.amount,
            accruedRent: ( matchingItem.amount / 365 ) * totalDays,
            refund: matchingItem.amount - (( matchingItem.amount / 365 ) * totalDays),
          };
        }
        return item;
      });
      setInputList(updatedInputList);
    }
  }, [router, totalDays, contractEndDate])


  
  
    

  const [search, setSearch] = useState('')

  const [buildingNameInEnglish, setBuildingNameInEnglish] = useState('')
  const [unitNo, setUnitNo] = useState(100)
  
  const [notes, setNotes] = useState('')  

  const [totalNoOfPages, setTotalNoOfPages] = useState(1)
  const [filteredData, setFilteredData] = useState([])

  const [openTenantExtraForm, setOpenTenantExtraForm] = React.useState(1);
  const handleOpenTenantExtraForm = (value) => setOpenTenantExtraForm(openTenantExtraForm === value ? 0 : value);
  
  const [tenant, setTenant] = useState('')
  const [tenantName, setTenantName] = useState('')
  const [tenantEmail, setTenantEmail] = useState('')
  const [tenantPhoneNo, setTenantPhoneNo] = useState('')
  const [tenantOpeningBalance, setTenantOpeningBalance] = useState('')

  const [tenantPassPortNumber, setTenantPassPortNumber] = useState('')
  const [tenantExpPassPort, setTenantExpPassPort] = useState('')
  const [tenantVatRegistrationNo, setTenantVatRegistrationNo] = useState('')
  const [tenantIbanNo, setTenantIbanNo] = useState('')
  const [tenantBank, setTenantBank] = useState('')
  const [tenantBankAccountNumber, setTenantBankAccountNumber] = useState('')
  const [tenantIdNumber, setTenantIdNumber] = useState('')
  const [tenantExpIdNumber, setTenantExpIdNumber] = useState('')

  
  const [newContractUnitRent, setNewContractUnitRent] = useState('')
  const [newContractCommission, setNewContractCommission] = useState('')
  const [newContractRentParking, setNewContractRentParking] = useState('')
  const [newContractBouncedChequeFine, setNewContractBouncedChequeFine] = useState('')
  const [newContractStatus, setNewContractStatus] = useState('')
  const [newContractPaymentScheduling, setNewContractPaymentScheduling] = useState('')
  const [newContractSecurityDeposit, setNewContractSecurityDeposit] = useState('')
  const [newContractNotes, setNewContractNotes] = useState('')
  


  // For print
  const componentRef = useRef();
  const speceficComponentRef = useRef();

  const handleChange = (e) => {
    const { name, value } = e.target;
      
    if (name === 'contractEndDate') {
      setContractEndDate(value);
    }
  }

  
  


  let paymentSchedulings = [ 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
  let newContractStatusArray = ['Active','Expired','Close']

  
  const newContractData = [
      
    {
      label: "End Contract",
      value: "endContract",
      icon: HiOutlineBuildingOffice2,
      desc: (
        <div>

          <div className='flex space-x-4 mb-14'>

            <div className="w-8/12">
              <label htmlFor="tenant" className="block text-sm font-medium text-gray-700">
                Tenant
              </label>
              <input
                type="text"
                onChange={handleChange}
                name="tenant"
                value={tenant}
                id="tenant"
                className="mt-1 p-2 block w-full rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
            </div>
            <div className="w-full">
              <label htmlFor="buildingNameInEnglish" className="block text-sm font-medium text-gray-700">
                Building
              </label>
              <input
                type="text"
                onChange={handleChange}
                name="buildingNameInEnglish"
                value={buildingNameInEnglish}
                id="buildingNameInEnglish"
                className="mt-1 p-2 block w-full rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
            </div>
            <div className="w-8/12">
              <label htmlFor="unitNo" className="block text-sm font-medium text-gray-700">
                Unit Number
              </label>
              <input
                type="number"
                onChange={handleChange}
                name="unitNo"
                value={unitNo}
                id="unitNo"
                className="mt-1 p-2 block w-full rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
            </div>
          </div>
          <div className='flex space-x-4 mb-14'>

            <div className="w-full">
              <label htmlFor="newContractStartDate" className="block text-sm font-medium text-gray-700">
               Contract Start Date
              </label>
              <input
                type="date"
                onChange={handleChange}
                name="contractStartDate"
                value={contractStartDate}
                id="contractStartDate"
                className="mt-1 p-2 block w-full rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
            </div>
            <div className="w-full">
              <label htmlFor="contractEndDate" className="block text-sm font-medium text-gray-700">
               Contract End Date
              </label>
              <input
                type="date"
                onChange={handleChange}
                name="contractEndDate"
                value={contractEndDate}
                id="contractEndDate"
                className="mt-1 p-2 block w-full rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
            </div>
            <div className="w-8/12">
              <label htmlFor="totalDays" className="block text-sm font-medium text-gray-700">
                Total Days
              </label>
              <input
                type="number"
                name="totalDays"
                value={totalDays}
                id="totalDays"
                className="cursor-not-allowed mt-1 p-2 block w-full rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                readOnly
              />
            </div>
          </div>

          <div className='flex space-x-4 mb-14'>

            <table className="w-full text-sm text-left text-gray-500 ">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                <tr>
                  <th scope="col" className="p-2">
                      Products / Services
                  </th>
                  <th scope="col" className="p-2">
                      Amount
                  </th>
                  <th scope="col" className="p-2">
                      Accrued Rent
                  </th>
                  <th scope="col" className="p-2">
                      Refund
                  </th>
                  <th scope="col" className="p-2">
                      Total
                  </th>
                </tr>
              </thead>

              <tbody >
              {inputList.map(( inputList , index)=>{
                return <tr key={index} className="bg-white text-black border-b hover:bg-gray-50">
                
                  <td className="p-2 w-1/3">
                    <select id="products" name="products" onChange={ e => change(e, index) } value={inputList.products} className="mt-1 p-2 block w-full rounded-md border border-gray-300 bg-white shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm">
                      <option value=''>select products</option>
                      {dbProducts.map((item, index)=>{
                        return <option key={index} value={item.name}>{item.name}</option>
                      })}
                    </select>
                  </td>

                  <td className="p-2">
                    <input
                      type="number"
                      value={ inputList.amount }
                      name="amount"
                      id="amount"
                      className="cursor-not-allowed mt-1 p-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                      readOnly
                    />
                  </td>

                  <td className="p-2">
                    <input
                      type="number"
                      value={ Math.floor(inputList.accruedRent) }
                      name="accruedRent"
                      id="accruedRent"
                      className="mt-1 p-2 cursor-not-allowed block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                      readOnly
                    />
                  </td>
                  <td className="p-2">
                    <input
                      type="number"
                      value={ Math.floor(inputList.refund) }
                      name="refund"
                      id="refund"
                      className="mt-1 p-2 cursor-not-allowed block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                      readOnly
                    />
                  </td>

                  <td className="p-2">
                    <input
                      type="number"
                      value = { inputList.totalAmountPerItem }
                      name="totalAmountPerItem"
                      id="totalAmountPerItem"
                      className="mt-1 p-2 cursor-not-allowed block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                      readOnly
                      />
                  </td>

                </tr>})}
                  
              </tbody>
            </table>

          </div>

          <div className='flex space-x-4 mb-14'>
            <textarea cols="30" rows="5" type="text"
              onChange={ handleChange }
              name="notes"
              placeholder='add your notes here...'
              value={notes}
              id="notes"
              className="mt-1 p-2 block w-full rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm">
            </textarea>
          </div>

        </div>
      ),
    },
    {
      label: "Refund Cheques",
      value: "refundCheques",
      icon: FiUsers,
      desc: (
        <div>
          <div>
            <Select size="md" label="Tenant Profile" name='tenant' id='tenant' value={tenant} onChange={(e) => setTenant(e)}>
              {dbTenants.map((item, index) => {
                return <Option key={index} value={item.name}>{item.name}</Option>;
              })}
            </Select>
          </div>
          <div className="bg-white py-5">
            <div className="grid grid-cols-6 gap-6">

              <div className="col-span-6 sm:col-span-1">
                <label htmlFor="tenantName" className="block text-sm font-medium text-gray-700">Name:</label>
                <input disabled type="tenantName" name="tenantName" id="tenantName" value={tenantName} className="cursor-not-allowed mt-1 p-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"/>
              </div>


              <div className="col-span-6 sm:col-span-1">
                <label htmlFor="tenantEmail" className="block text-sm font-medium text-gray-700">Email address</label>
                <input disabled value={tenantEmail} type="text" name="tenantEmail" id="tenantEmail" autoComplete="email" className="cursor-not-allowed mt-1 p-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"/>
              </div>

              <div className="col-span-6 sm:col-span-1">
                <label htmlFor="tenantPhoneNo" className="block text-sm font-medium text-gray-700">Phone Number</label>
                <input disabled value={tenantPhoneNo} type="number" name="tenantPhoneNo" id="tenantPhoneNo" className="cursor-not-allowed mt-1 p-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"/>
              </div>

              <div className="col-span-6 sm:col-span-1">
                <label htmlFor="tenantOpeningBalance" className="block text-sm font-medium text-gray-700">Opening Balance</label>
                <input disabled value={tenantOpeningBalance} type="number" name="tenantOpeningBalance" id="tenantOpeningBalance" className="cursor-not-allowed mt-1 p-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"/>
              </div>

              <div className="col-span-6 sm:col-span-1">
                <label htmlFor="tenantIdNumber" className="block text-sm font-medium text-gray-700">Id Personal Number</label>
                <input onChange={handleChange} value={tenantIdNumber} type="number" name="tenantIdNumber" id="tenantIdNumber" className="mt-1 p-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"/>
              </div>

              <div className="col-span-6 sm:col-span-1">
                <label htmlFor="tenantExpIdNumber" className="block text-sm font-medium text-gray-700">Expiry Date Id Number</label>
                <input onChange={handleChange} value={tenantExpIdNumber} type="date" name="tenantExpIdNumber" id="tenantExpIdNumber" className="mt-1 p-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"/>
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
                      onChange={handleChange}
                      name="tenantPassPortNumber"
                      value={tenantPassPortNumber}
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
                      onChange={handleChange}
                      name="tenantExpPassPort"
                      id="tenantExpPassPort"
                      value={tenantExpPassPort}
                      className="mt-1 p-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    />
                  </div>

                  <div className="w-full">
                    <label htmlFor="tenantVatRegistrationNo" className="block text-sm font-medium text-gray-700">
                      Vat Registration No
                    </label>
                    <input 
                      type="number"
                      onChange={handleChange}
                      name="tenantVatRegistrationNo"
                      id="tenantVatRegistrationNo"
                      value={tenantVatRegistrationNo}
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
                      onChange={handleChange}
                      name="tenantIbanNo"
                      value={tenantIbanNo}
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
                      onChange={handleChange}
                      name="tenantBank"
                      id="tenantBank"
                      value={tenantBank}
                      className="mt-1 p-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    />
                  </div>

                  <div className="w-full">
                    <label htmlFor="tenantBankAccountNumber" className="block text-sm font-medium text-gray-700">
                      Bank Account Number
                    </label>
                    <input 
                      type="number"
                      onChange={handleChange}
                      name="tenantBankAccountNumber"
                      id="tenantBankAccountNumber"
                      value={tenantBankAccountNumber}
                      className="mt-1 p-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    />
                  </div>
                  
                </div>
              </div>
              
            </AccordionBody>
          </Accordion>

          <div className="flex items-center justify-center w-full mt-10">
            <label htmlFor="dropzone-file" className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <svg className="w-8 h-8 mb-4 text-gray-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                  <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"/>
                </svg>
                <p className="mb-2 text-sm text-gray-500"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                <p className="text-xs text-gray-500">SVG, PNG, JPG or GIF (MAX. 800x400px)</p>
              </div>
              <input id="dropzone-file" type="file" className="hidden" />
            </label>
          </div>


        </div>
      ),
    },
    {
      label: "Show Statement",
      value: "showStatement",
      icon: BsCashCoin,
      desc: (
        <div>

          {/* <div className='flex space-x-4 mb-14'>
            <div className="w-full">
              <label htmlFor="newContractStartDate" className="block text-sm font-medium text-gray-700">
               Contract Start Date
              </label>
              <input
                type="date"
                onChange={handleChange}
                name="newContractStartDate"
                value={newContractStartDate}
                id="newContractStartDate"
                className="mt-1 p-2 block w-full rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
            </div>
            <div className="w-full">
              <label htmlFor="newContractEndDate" className="block text-sm font-medium text-gray-700">
               Contract End Date
              </label>
              <input
                type="date"
                onChange={handleChange}
                name="newContractEndDate"
                value={newContractEndDate}
                id="newContractEndDate"
                className="mt-1 p-2 block w-full rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
            </div>
            <div className="w-full">
              <label htmlFor="newContractUnitRent" className="block text-sm font-medium text-gray-700">
                Unit Rent
              </label>
              <input
                type="number"
                onChange={handleChange}
                name="newContractUnitRent"
                value={newContractUnitRent}
                id="newContractUnitRent"
                className="mt-1 p-2 block w-full rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
            </div>
          </div>
          <div className='flex space-x-4 mb-14'>
            
            <div className="w-full">
              <label htmlFor="newContractCommission" className="block text-sm font-medium text-gray-700">
                Commision
              </label>
              <input
                type="number"
                onChange={handleChange}
                name="newContractCommission"
                value={newContractCommission}
                id="newContractCommission"
                className="mt-1 p-2 block w-full rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
            </div>
            <div className="w-full">
              <label htmlFor="newContractRentParking" className="block text-sm font-medium text-gray-700">
                Rent Parking
              </label>
              <input
                type="number"
                onChange={handleChange}
                name="newContractRentParking"
                value={newContractRentParking}
                id="newContractRentParking"
                className="mt-1 p-2 block w-full rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
            </div>
            <div className="w-full">
              <label htmlFor="newContractBouncedChequeFine" className="block text-sm font-medium text-gray-700">
                Bounced Cheque Fine
              </label>
              <input
                type="number"
                onChange={handleChange}
                name="newContractBouncedChequeFine"
                value={newContractBouncedChequeFine}
                id="newContractBouncedChequeFine"
                className="mt-1 p-2 block w-full rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
            </div>
          </div> */}
          <div className='flex space-x-4 mb-14'>

            <div className="w-full">
              <label htmlFor="newContractSecurityDeposit" className="block text-sm font-medium text-gray-700">
                Security Deposit
              </label>
              <input
                type="number"
                onChange={handleChange}
                name="newContractSecurityDeposit"
                value={newContractSecurityDeposit}
                id="newContractSecurityDeposit"
                className="mt-1 p-2 block w-full rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
            </div>
            <div className="w-full">
              <label htmlFor="newContractStatus" className="block text-sm font-medium text-gray-700">
                Contract Status
              </label>
              <select id="newContractStatus" name="newContractStatus" onChange={ handleChange } value={newContractStatus} className="mt-1 p-2 block w-full rounded-md border border-gray-300 bg-white shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm">
                <option value=''>select contract status</option>
                {newContractStatusArray.map((item, index)=>{
                  return <option key={index} value={item}>{item}</option>
                })}
              </select>
            </div>
            <div className="w-full">
              <label htmlFor="newContractPaymentScheduling" className="block text-sm font-medium text-gray-700">
                Payment Scheduling
              </label>
              <select id="newContractPaymentScheduling" name="newContractPaymentScheduling" onChange={ handleChange } value={newContractPaymentScheduling} className="mt-1 p-2 block w-full rounded-md border border-gray-300 bg-white shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm">
                <option value=''>select payment scheduling</option>
                {paymentSchedulings.map((item, index)=>{
                  return <option key={index} value={item}>{item}</option>
                })}
              </select>
            </div>
            
          </div>
          <div className='flex space-x-4'>

            <div className="w-full">
              <textarea cols="30" rows="5" type="text"
                onChange={handleChange}
                value={newContractNotes}
                name="newContractNotes"
                id="newContractNotes"
                placeholder='add your notes here...'
                className="mt-1 p-2 block w-full rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm">
              </textarea>
              
            </div>
            
          </div>

          <div className="flex items-center justify-center w-full mt-10">
            <label htmlFor="dropzone-file" className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <svg className="w-8 h-8 mb-4 text-gray-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                  <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"/>
                </svg>
                <p className="mb-2 text-sm text-gray-500"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                <p className="text-xs text-gray-500">SVG, PNG, JPG or GIF (MAX. 800x400px)</p>
              </div>
              <input id="dropzone-file" type="file" className="hidden" />
            </label>
          </div>
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

    <Transition.Root show={open === 'true' ? true : false} as={Fragment}>
      <Dialog as="div" className="relative z-20" onClose={()=>{router.push('/panel/realEstate/contractAndTenants')}}>
        <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0" enterTo="opacity-100" leave="ease-in duration-200" leaveFrom="opacity-100" leaveTo="opacity-0">
          <div className="fixed inset-0 hidden bg-gray-500 bg-opacity-75 transition-opacity md:block" />
        </Transition.Child>
        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex min-h-full items-stretch justify-center text-center md:items-center md:px-2 lg:px-4">
            <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0 translate-y-4 md:translate-y-0 md:scale-95" enterTo="opacity-100 translate-y-0 md:scale-100" leave="ease-in duration-200" leaveFrom="opacity-100 translate-y-0 md:scale-100" leaveTo="opacity-0 translate-y-4 md:translate-y-0 md:scale-95">
              <Dialog.Panel className="flex w-full transform text-left text-base transition md:my-8 md:max-w-2xl md:px-2 lg:max-w-5xl">
                <div className="relative flex w-full items-center overflow-hidden bg-white px-4 pt-14 pb-8 shadow-2xl sm:px-6 sm:pt-8 md:p-6">
                  <button type='button' className="absolute top-4 right-4 text-gray-400 hover:text-gray-500 sm:top-8 sm:right-6 md:top-6 md:right-6 lg:top-6 lg:right-8" onClick={() => router.push('/panel/realEstate/contractAndTenants')}>
                    <span className="sr-only">Close</span>
                    <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                  </button>

                  <div className='w-full'>
                    <form method="POST" onSubmit={(e)=>{submitNewContract(e, false)}}>
                      <div className="overflow-hidden shadow sm:rounded-md">
                        <div ref={speceficComponentRef} className="bg-white py-5">


                          <Tabs value="endContract">
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
                            <TabsBody className='mt-5'>
                              {newContractData.map(({ value, desc }) => (
                                <TabPanel key={value} value={value}>
                                  {desc}
                                </TabPanel>
                              ))}
                            </TabsBody>
                          </Tabs>

                          <div className="bg-gray-50 space-x-3 px-4 py-3 text-right sm:px-6">

                            <ReactToPrint
                              trigger={()=>{
                                return <button 
                                  type="button"
                                  className='inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2'>
                                  Print
                                  <AiOutlinePrinter className='text-lg ml-2'/>
                                </button>
                              }}
                              content={() => speceficComponentRef.current}
                              documentTitle='Building and Owner'
                              pageStyle='print'
                            />

                            <button type="submit" onClick={(e)=>{submitNewContract(e)}} className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">Save Contract</button>
                          </div>
                        </div>
                      </div>
                    </form>
                  </div>

                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>

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
  let dbContacts = await Contact.find()
  let dbContracts = await ContractAndTenant.find()
  let dbTenants = await Contact.find({'type': 'Tenant'})
  let dbProducts = await Product.find()

  // Pass data to the page via props
  return {
    props: {
      dbContacts: JSON.parse(JSON.stringify(dbContacts)),
      dbContracts: JSON.parse(JSON.stringify(dbContracts)), 
      dbTenants: JSON.parse(JSON.stringify(dbTenants)),
      dbProducts: JSON.parse(JSON.stringify(dbProducts)),
    }
  }
}

export default ContractTermination