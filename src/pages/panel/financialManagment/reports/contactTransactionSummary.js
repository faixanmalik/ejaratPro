import React, { useEffect, useRef, useState } from 'react'
import mongoose from "mongoose";
import moment from 'moment/moment';
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import Contact from 'models/Contact';
import { ProSidebarProvider } from 'react-pro-sidebar';
import FullLayout from '@/panel/layouts/FullLayout';

import JournalVoucher from 'models/JournalVoucher';
import Charts from 'models/Charts';
import CreditSalesInvoice from 'models/CreditSalesInvoice';
import SalesInvoice from 'models/SalesInvoice';
import PurchaseInvoice from 'models/PurchaseInvoice';
import DebitNote from 'models/DebitNote';
import CreditNote from 'models/CreditNote';
import ReceiptVoucher from 'models/ReceiptVoucher';
import PaymentVoucher from 'models/PaymentVoucher';
import Expenses from 'models/Expenses';
import useTranslation from 'next-translate/useTranslation';
import ReactToPrint from 'react-to-print';
import { AiOutlinePrinter } from 'react-icons/ai';

const ContactTransactionSummary = (
  { userEmail, dbExpensesVoucher, dbPaymentVoucher, dbReceipts, 
    dbCreditNotes, dbCreditNote, dbPurchaseInvoice, 
    dbSalesInvoice, dbCreditSalesInvoices, dbJournalVoucher, 
    dbContacts }) => {

  // Cash Receipt
  const { t } = useTranslation('reporting')
  const componentRef = useRef();
  const [printButton, setPrintButton] = useState(false)
  
  const [fromDate, setFromDate] = useState('')
  const [toDate, setToDate] = useState('') 
  const [sortBy, setsortBy] = useState('')
  const [contact, setContact] = useState('')
  const [filteredTrx, setFilteredTrx] = useState([])
  const [filteredContacts, setFilteredContacts] = useState([])

  useEffect(() => {
    let filteredContacts = dbContacts.filter((item)=>{
        return item.userEmail === userEmail;
    })
    setFilteredContacts(filteredContacts)
}, [userEmail])

  const submit = ()=>{
    
    setPrintButton(true);
    
    if(contact){
      
      let filteredTrx = []
      // Credit Sales Invoice
      dbCreditSalesInvoices = dbCreditSalesInvoices
        .filter((item) => item.name === `${contact}` && item.userEmail === userEmail)
        .map((item) => ({
          ...item,
          journalNo: item.billNo,
          chequeStatus: 'Received',
          trxTotalDebit: parseInt(item.totalAmount, 10),
          trxTotalCredit: 0,
          balance: 0,
        }));


      // Credit Note Invoice
      dbCreditNotes = dbCreditNotes
        .filter((item) => item.name === `${contact}` && item.userEmail === userEmail)
        .map((item) => ({
          ...item,
          chequeStatus: 'Received',
          trxTotalDebit: 0,
          trxTotalCredit: parseInt(item.totalAmount, 10),
          balance: 0,
        }));


      // Payment Voucher
      dbPaymentVoucher = dbPaymentVoucher
        .filter((item) => item.name === `${contact}` && item.userEmail === userEmail)
        .map((item) => ({
          ...item,
          chequeStatus: 'Received',
          trxTotalDebit: parseInt(item.totalPaid, 10),
          trxTotalCredit: 0,
          balance: 0,
        }));

      // Receipts Voucher
      dbReceipts = dbReceipts
        .filter((item) => item.name === `${contact}` && item.userEmail === userEmail)
        .map((item) => {
          const filteredInputList = item.inputList;
          const totalAmount = filteredInputList.reduce((total, item) => total + parseInt(item.paid), 0);

          if (filteredInputList.length > 0) {
            return {
              ...item,
              chequeStatus: 'Deposited',
              trxTotalDebit: 0,
              trxTotalCredit: parseInt(totalAmount, 10),
              balance: 0,
            };
          }
        });

      filteredTrx = filteredTrx.concat( dbCreditSalesInvoices, dbReceipts, dbCreditNotes, dbPaymentVoucher);
      setFilteredTrx(filteredTrx);
    }
  }

  const handleChange = (e) => {
    if (e.target.name === 'contact') {
      setContact(e.target.value)
    }
    else if (e.target.name === 'fromDate') {
      setFromDate(e.target.value)
    }
    else if (e.target.name === 'toDate') {
      setToDate(e.target.value)
    }
  }
    
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
  <ToastContainer position="bottom-center" autoClose={1000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover theme="light" />

  <div className='w-full'>
    <form method="POST">
      <div className="overflow-idden shadow sm:rounded-md">
        <div className="bg-white px-4 sm:p-3">
          <div className="grid grid-cols-6 gap-6">
            <div className="col-span-6 sm:col-span-1">
                <label htmlFor="fromDate" className="block text-sm font-medium text-gray-700">
                    {t('from')}
                </label>
                <input
                    type="date"
                    onChange={handleChange}
                    name="fromDate"
                    id="fromDate"
                    value={fromDate}
                    className="mt-1 p-2 block w-full rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
            </div>
            <div className="col-span-6 sm:col-span-1">
                <label htmlFor="toDate" className="block text-sm font-medium text-gray-700">
                    {t('to')}
                </label>
                <input
                    type="date"
                    onChange={handleChange}
                    name="toDate"
                    id="toDate"
                    value={toDate}
                    className="mt-1 p-2 block w-full rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
            </div>
            <div className="col-span-6 sm:col-span-3">
                <label htmlFor="contact" className="block text-sm font-medium text-gray-700">
                    {t('contacts')}
                </label>
                <select id="contact" name="contact" onChange={handleChange} value={contact} className="mt-1 p-2 block w-full rounded-md border border-gray-300 bg-white shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm">
                    <option>select contact</option>
                    {filteredContacts.map((item, index) => {
                      return <option key={index} value={item.name}>{item.name}</option>
                    })}
                </select>
            </div>
            <button onClick={submit} type='button' className='bg-blue-800 hover:bg-blue-900 text-white px-10 h-10 mt-4 rounded-lg'>{t('update')}</button>
          </div>
        </div>
      </div>
    </form>
  </div>

  <div className="md:grid md:grid-cols-1 md:gap-2">
    <div className="md:col-span-1">
      <div className="px-4 mt-4 sm:px-0 flex">
        <h3 className="text-lg mx-auto font-black tracking-wide leading-6 text-blue-800">{t('contactsTitle')}</h3>
      </div>
      <div className='flex justify-end'>
        {printButton == true ? <ReactToPrint
          trigger={()=>{
            return <button 
              type="button"
              className='inline-flex items-center justify-center py-1 px-3 bg-blue-800 hover:bg-blue-900 text-white rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500'>
              {t('print')}
              <AiOutlinePrinter className='text-lg ml-2'/>
            </button>
          }}
          content={() => componentRef.current}
          documentTitle={`${userEmail} - (${contact}) Transactions Summary`}
          pageStyle='print'
          />: ''}
      </div>
    </div>
    <div className="md:col-span-2">
      <form method="POST">
        <div ref={componentRef} className="overflow-hidden shadow sm:rounded-md">
          <div className="overflow-x-auto shadow-sm">
            <table className="w-full text-sm text-left text-gray-500 ">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3">
                    {t('voucherNo')}
                  </th>
                  <th scope="col" className="px-6 py-3">
                    {t('name')}
                  </th>
                  <th scope="col" className="px-6 py-3">
                    {t('date')}
                  </th>
                  <th scope="col" className="px-6 py-3">
                    {t('debit')}
                  </th>
                  <th scope="col" className="px-6 py-3">
                    {t('credit')}
                  </th>
                  <th scope="col" className="px-6 py-3">
                    {t('balance')}
                  </th>
                </tr>
              </thead>
              <tbody>

                {/* All Vouchers */}
                {filteredTrx.map((item, index) => {

                  let previousBalance = 0;
                  filteredTrx.forEach((item) => {
                    item.balance = previousBalance + item.trxTotalDebit - item.trxTotalCredit;
                    previousBalance = item.balance;
                  });

                  return <tr key={index} className="bg-white border-b hover:bg-gray-50">
                    <td className="px-6 py-3">
                      {item.journalNo ? item.journalNo: item.billNo}
                    </td>
                    <td className="px-6 py-3 text-blue-700 font-bold">
                      {item.name}
                    </td>
                    
                    <td className="px-6 py-3">
                      {item.date 
                        ? moment(item.date).utc().format('DD-MM-YYYY')
                        : moment(item.journalDate).utc().format('DD-MM-YYYY')
                      }
                    </td>
                    <td className="px-6 py-3">
                      {parseInt(item.trxTotalDebit).toLocaleString()}
                    </td>
                    <td className="px-6 py-3">
                      {parseInt(item.trxTotalCredit).toLocaleString()}
                    </td>
                    <td className="px-6 py-3">
                      {parseInt(item.balance).toLocaleString()}
                    </td>
                  </tr>
                })}
              </tbody>
            </table>
            { filteredTrx.length === 0  ? <h1 className='text-red-600 text-center text-base my-3'>No data found!</h1> : ''}
          </div>
        </div>
      </form>
    </div>
  </div>

  </FullLayout>
  </ProSidebarProvider>

  </>
  )
}

export async function getServerSideProps() {
  if (!mongoose.connections[0].readyState) {
    mongoose.set("strictQuery", false);
    await mongoose.connect(process.env.MONGO_URI)
  }
  let dbJournalVoucher = await JournalVoucher.find()
  let dbContacts = await Contact.find()

  let dbCreditSalesInvoice = await CreditSalesInvoice.find()
  let dbSalesInvoice = await SalesInvoice.find()
  let dbPurchaseInvoice = await PurchaseInvoice.find()
  let dbDebitNote = await DebitNote.find()
  let dbCreditNote = await CreditNote.find()
  let dbReceiptVoucher = await ReceiptVoucher.find()
  let dbPaymentVoucher = await PaymentVoucher.find()
  let dbExpensesVoucher = await Expenses.find()


  // Pass data to the page via props
  return {
    props: {
      dbJournalVoucher: JSON.parse(JSON.stringify(dbJournalVoucher)),
      dbContacts: JSON.parse(JSON.stringify(dbContacts)),

      dbCreditSalesInvoices: JSON.parse(JSON.stringify(dbCreditSalesInvoice)),
      dbSalesInvoice: JSON.parse(JSON.stringify(dbSalesInvoice)),
      dbPurchaseInvoice: JSON.parse(JSON.stringify(dbPurchaseInvoice)),
      dbDebitNote: JSON.parse(JSON.stringify(dbDebitNote)),
      dbCreditNotes: JSON.parse(JSON.stringify(dbCreditNote)),
      dbReceipts: JSON.parse(JSON.stringify(dbReceiptVoucher)),
      dbPaymentVoucher: JSON.parse(JSON.stringify(dbPaymentVoucher)),
      dbExpensesVoucher: JSON.parse(JSON.stringify(dbExpensesVoucher)),
    }
  }
}

export default ContactTransactionSummary