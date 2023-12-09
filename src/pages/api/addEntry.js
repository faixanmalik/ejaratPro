// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import BankAccount from 'models/BankAccount';
import Charts from 'models/Charts';
import Contact from 'models/Contact';
import Employees from 'models/Employees';
import Product from 'models/Product';
import Role from 'models/Role';
import PurchaseInvoice from 'models/PurchaseInvoice';
import TaxRate from 'models/TaxRate';
import DebitNote from 'models/DebitNote';
import CreditNote from 'models/CreditNote';
import SalesInvoice from 'models/SalesInvoice';
import Expenses from 'models/Expenses';
import PaymentVoucher from 'models/PaymentVoucher';
import CreditSalesInvoice from 'models/CreditSalesInvoice';
import ReceiptVoucher from 'models/ReceiptVoucher';
import PaymentMethod from 'models/PaymentMethod';
import JournalVoucher from 'models/JournalVoucher';
import Buildings from 'models/Buildings';
import Units from 'models/Units';
import ContractAndTenant from 'models/ContractAndTenant';
import Cheque from 'models/Cheque';
import ChequeTransaction from 'models/ChequeTransaction';


export default async function handler(req, res) {

    if (req.method == 'POST'){
        const { path } = req.body;

        if( path === 'employees'){
          const { userEmail, name, fatherName, dob, email, cnic,  phoneNo, citizenship, gender, maritalStatus, designation, department, workShift, workHour, employmentMode, payPolicy, basicPay, paymentMode, status, hireDate, siteName, joiningDate, country, streetAddress, city, state, zip, row, importEntries  } = req.body;
          if(importEntries){
            await Employees.insertMany(row);
            res.status(200).json({ success: true, message: "Entry Added!" }) 
          }
          else{
            let newEntry = new Employees( { userEmail, name, fatherName, dob, email, cnic,  phoneNo, citizenship, gender, maritalStatus, designation, department, workShift, workHour, employmentMode, payPolicy, basicPay, paymentMode, status, hireDate, siteName, joiningDate, country, streetAddress, city, state, zip } );
            await newEntry.save();
            res.status(200).json({ success: true, message: "Entry Added!" }) 
          }

        }
        else if( path === 'chartsOfAccounts'){
          const { userEmail, accountCode, accountName, account, balance , asof, desc, subAccount, row, importEntries  } = req.body;

          let dbChart = await Charts.findOne({accountCode})
          if(dbChart){
            res.status(400).json({ success: false, message: "Already Found!" }) 
          }
          else{
            if(importEntries){
              await Charts.insertMany(row);
              res.status(200).json({ success: true, message: "Entry Added!" }) 
            }
            else{

              let newCharts = new Charts( { userEmail, account, accountCode, accountName, balance , asof, desc, subAccount } );
              await newCharts.save();
              res.status(200).json({ success: true, message: "Entry Added!" }) 
            }
          }
        }
        else if( path === 'bankAccount'){
          const { userEmail, bankBranch, accountNo, accountType, accountDesc, accountTitle, chartsOfAccount,  borrowingLimit, importEntries, row } = req.body;

          if(importEntries){
            await BankAccount.insertMany(row);
            res.status(200).json({ success: true, message: "Entry Added !" }) 
          }
          else{
            let newBankAccount = new BankAccount( { userEmail, bankBranch, accountNo, accountType, accountDesc, accountTitle, chartsOfAccount,  borrowingLimit } );
            await newBankAccount.save();
            res.status(200).json({ success: true, message: "Entry Added !" }) 
          }
        }
        else if( path === 'contactList'){
          const { userEmail, name, type, accounts, email, phoneNo, country, streetAddress, city, state, zip, taxRigNo, paymentMethod, terms , openingBalance, date, row, importEntries } = req.body;

          if(importEntries){
            await Contact.insertMany(row);
            res.status(200).json({ success: true, message: "Entry Added !" }) 
          }
          else{
            let newContact = new Contact( { userEmail, name, type, accounts, email, phoneNo, country, streetAddress, city, state, zip, taxRigNo, paymentMethod, terms , openingBalance, date } );
            await newContact.save();
            res.status(200).json({ success: true, message: "Entry Added !" }) 
          }
        }
        else if( path === 'productAndServices'){
          const { userEmail, code, name, linkAccount, linkContract, desc, row, importEntries  } = req.body;

          if(importEntries){
            Product.insertMany(row);
            res.status(200).json({ success: true, message: "Entry Added !" }) 
          }
          else{
            let newProduct = new Product( { userEmail, code, name, linkAccount, linkContract, desc  } );
            await newProduct.save();
            res.status(200).json({ success: true, message: "Entry Added !"}) 
          }
        }
        else if( path === 'addRole'){
          const { userEmail, roleName, roleDesc } = req.body;
          
          let newEntry = new Role( { userEmail, roleName, roleDesc } );
          await newEntry.save();
          res.status(200).json({ success: true, message: "Entry Added!" }) 
        }
        else if( path === 'PaymentMethod'){
          const { userEmail, paymentType, chartsOfAccount } = req.body;
          
          let newEntry = new PaymentMethod( { userEmail, paymentType, chartsOfAccount } );
          await newEntry.save();
          res.status(200).json({ success: true, message: "Entry Added!" }) 
        }
        else if( path === 'journalVoucher'){
          const { userEmail, totalDebit , totalCredit, inputList, name, dec, memo, journalDate, journalNo, attachment, path } = req.body;

          let dbJV = await JournalVoucher.findOne({ journalNo })

          if( dbJV ){
            res.status(400).json({ success: false, message: "Already Found!" }) 
          }
          else{
            let newEntry = new JournalVoucher( { userEmail, totalDebit , totalCredit, inputList , name, dec , memo, journalDate, journalNo, attachment, path } );
            await newEntry.save();
            
            res.status(200).json({ success: true, message: "Entry Added !" }) 
          }   
        }


        // Credit Sales Invoice
        else if( path === 'CreditSalesInvoice'){
          const { userEmail, contractId, phoneNo, email, discount, billStatus, amountPaid, amountReceived, city, address, reference, dueDate, inputList, name,  memo, journalDate, billNo, fullAmount, fullTax, totalAmount, attachment, path, importEntries, row } = req.body;

          if(contractId){
            await ContractAndTenant.findByIdAndUpdate(contractId, { newContractStatus: 'Close', unitStatus:'Available' });
          }
          let newEntry = new CreditSalesInvoice( { userEmail, contractId, phoneNo, email, discount, billStatus, amountPaid, amountReceived, city, address, reference, dueDate, inputList, name,  memo, journalDate, billNo, fullAmount, fullTax, totalAmount, attachment, type:path } );
          await newEntry.save();
          res.status(200).json({ success: true, message: "Entry Added !" }) 
        }

        // Purchase Invoice
        else if( path === 'PurchaseInvoice'){
          const { userEmail, phoneNo, email, discount, billStatus, amountPaid, amountReceived, city, address, reference, dueDate, inputList, name,  memo, journalDate, billNo, fullAmount, fullTax, totalAmount, attachment, path, importEntries, row } = req.body;

          let newEntry = new PurchaseInvoice( { userEmail, phoneNo, email, discount, billStatus, amountPaid, amountReceived, city, address, reference, dueDate, inputList, name,  memo, journalDate, billNo, fullAmount, fullTax, totalAmount, attachment, type:path } );
          await newEntry.save();
          res.status(200).json({ success: true, message: "Entry Added !" }) 
        }
        
        // Tax Rate
        else if( path === 'TaxRate'){
          const { userEmail, name, taxRate, chartsOfAccount } = req.body;
          
          let newEntry = new TaxRate( { userEmail, name, taxRate, chartsOfAccount } );
          await newEntry.save();
          res.status(200).json({ success: true, message: "Entry Added!" }) 
        }

        // Credit Note Invoice
        else if( path === 'CreditNote'){
          const { userEmail, contractId, phoneNo, email, city, address, project, dueDate, inputList, name,  memo, journalDate, journalNo, fullAmount, fullTax, totalAmount, attachment, path, importEntries, row } = req.body;

          if(contractId){
            await ContractAndTenant.findByIdAndUpdate(contractId, { newContractStatus: 'Close', unitStatus:'Available' });
          }

          let newEntry = new CreditNote( { userEmail, contractId, phoneNo, email, city, address, project, dueDate, inputList, name,  memo, journalDate, journalNo, fullAmount, fullTax, totalAmount, attachment, type:path } );
          await newEntry.save();
          res.status(200).json({ success: true, message: "Entry Added !" }) 
        }

        // Debit Note Invoice
        else if( path === 'DebitNote' ){
            const { userEmail, phoneNo, email, project, city, address, reference, accuralDate, inputList, name,  memo, journalDate, billNo, fullAmount, fullTax, totalAmount, attachment, path, importEntries, row } = req.body;

            let newEntry = new DebitNote( { userEmail, phoneNo, email, project, city, address, reference, accuralDate, inputList, name,  memo, journalDate, billNo, fullAmount, fullTax, totalAmount, attachment, type:path } );
            await newEntry.save();
            res.status(200).json({ success: true, message: "Entry Added !" }) 
        }

        else if( path === 'SalesInvoice'){
          const { userEmail, phoneNo, email, chqNo, discount, city, fromAccount, receivedBy, project, dueDate, inputList, name,  memo, journalDate, journalNo, fullAmount, fullTax, totalAmount, attachment, path, importEntries, row } = req.body;

          try {

            let newChequeEntry = new Cheque( { userEmail, phoneNo, email, chqNo, discount, city, fromAccount, receivedBy, project, dueDate, inputList, name,  memo, journalDate, journalNo, fullAmount, fullTax, totalAmount, attachment, type:path } );
            await newChequeEntry.save();

            let newEntry = new SalesInvoice( { userEmail, phoneNo, email, chqNo, discount, city, fromAccount, receivedBy, project, dueDate, inputList, name,  memo, journalDate, journalNo, fullAmount, fullTax, totalAmount, attachment, type:path } );
            await newEntry.save();
            res.status(200).json({ success: true, message: "Entry Added !" }) 

          } catch (error) {
            console.log(error);
          }
        }

        // Expenses Invoice
        else if( path === 'Expenses'){
            const { userEmail, phoneNo, email, city, paidBy, project, dueDate, inputList, name,  memo, journalDate, journalNo, fullAmount, fullTax, totalAmount, attachment, path, importEntries, row } = req.body;

            let newEntry = new Expenses( { userEmail, phoneNo, email, city, paidBy, project, dueDate, inputList, name,  memo, journalDate, journalNo, fullAmount, fullTax, totalAmount, attachment, type:path } );
            await newEntry.save();
            res.status(200).json({ success: true, message: "Entry Added !" }) 
        }


        // Payment Voucher Invoice
        else if( path === 'PaymentVoucher'){
            const { userEmail, phoneNo, email, city, reference, fromAccount, paidBy, amount, dueDate, inputList, name,  memo, journalDate, journalNo, totalPaid, totalBalance, attachment, path, importEntries, row } = req.body;

        
            for (const newItem of inputList) {
              if(newItem.id){
                await PurchaseInvoice.findByIdAndUpdate(newItem.id, { $inc: { amountPaid: newItem.paid } });
              }
            }
            
            let purchaseInvoices = await PurchaseInvoice.find()

            for (const item of purchaseInvoices) {

                if(item.amountPaid === item.totalAmount) {
                    await PurchaseInvoice.findByIdAndUpdate(item.id, { billStatus: 'paid' });
                }
                else if(item.amountPaid > item.totalAmount) {
                    await PurchaseInvoice.findByIdAndUpdate(item.id, { billStatus: 'Advance' });
                }
                else if (item.amountReceived === item.totalAmount) {
                    await PurchaseInvoice.findByIdAndUpdate(item.id, { billStatus: 'returned' });
                }
                else {
                    await PurchaseInvoice.findByIdAndUpdate(item.id, { billStatus: 'unpaid' });
                }
            }
            
            let newEntry = new PaymentVoucher( { userEmail, phoneNo, email, city, reference, fromAccount, paidBy, amount, dueDate, inputList, name,  memo, journalDate, journalNo, totalPaid, totalBalance, attachment, type:path } );
            await newEntry.save();

            res.status(200).json({ success: true, message: "Entry Added !" }) 
        }
    
        // Receipt Voucher Invoice
        else if( path === 'ReceiptVoucher'){
          const { userEmail, phoneNo, email, city, reference, amount, inputList, name,  memo, journalDate, journalNo, totalPaid, project, attachment, path, importEntries, row } = req.body;

          const modifiedInputList = inputList.map((item) => {
            return {
              userEmail,
              phoneNo,
              email,
              city,
              reference,
              amount,
              inputList: [item], // Use an array with the current item
              name,
              memo,
              journalDate,
              journalNo,
              totalPaid,
              project,
              attachment,
              type:path,
            };
          })

          await Promise.all(
            modifiedInputList.map(async (data) => {
              const newEntry = new Cheque(data);
              await newEntry.save();
            })
          );

          for (const newItem of inputList) {
            await CreditSalesInvoice.findOneAndUpdate({billNo:newItem.billNo}, { $inc: { amountPaid: newItem.paid } });
          }

          let Invoices = await CreditSalesInvoice.find()
          for (const item of Invoices) {
            if(item.amountPaid === item.totalAmount) {
              await CreditSalesInvoice.findByIdAndUpdate(item.id, { billStatus: 'paid' });
            }
            else {
              await CreditSalesInvoice.findByIdAndUpdate(item.id, { billStatus: 'unpaid' });
            }
          }
          
          let newEntry = new ReceiptVoucher( { userEmail, phoneNo, email, city, reference, amount, inputList, name,  memo, journalDate, journalNo, totalPaid, project, attachment, type:path } );
          await newEntry.save();

          res.status(200).json({ success: true, message: "Entry Added !" }) 
        }


        // Receipt Voucher Invoice
        else if( path === 'Buildings'){
          const { userEmail, receiveUnitsArray, nameInInvoice, lessorName, adjective, buildingType, idNumber, expID, bank, passPortNumber, expPassPort, nationality, ibanNo, vatRegistrationNo, bankAccountNumber, tradeLicenseNo, buildingNameInArabic, buildingNameInEnglish, totalUnits, unitsPerFloor, parkings, roof, country, city, area, mizan, plotArea, floor, buildingArea, electricityMeterNo, titleDeedNo, contractStartDate, investmentStructure, gracePeriodFrom, contractEndDate, amount, gracePeriodTo, paymentScheduling, attachment, name, phoneNo, email, path, importEntries, row } = req.body;

            for (const unit of receiveUnitsArray) {

              let rent = unit.unitRent;
              const unitDocument = {
                nameInBill:nameInInvoice, userEmail, name, phoneNo, email, buildingNameInEnglish, expID, idNumber, expPassPort, passPortNumber, contractStartDate, investmentStructure, gracePeriodFrom, contractEndDate, amount, gracePeriodTo, paymentScheduling, attachment,
                parkings, roof, rent, country, city, area, electricityMeterNo, contractStartDate, investmentStructure, gracePeriodFrom, contractEndDate, amount, gracePeriodTo, paymentScheduling,
                ...unit
              };
        
              await Units.create(unitDocument);
              console.log('Unit inserted:', unitDocument);
            }

            let newEntry = new Buildings( { userEmail, receiveUnitsArray, nameInInvoice, lessorName, adjective, buildingType, idNumber, expID, bank, passPortNumber, expPassPort, nationality, ibanNo, vatRegistrationNo, bankAccountNumber, tradeLicenseNo, buildingNameInArabic, buildingNameInEnglish, totalUnits, unitsPerFloor, parkings, roof, country, city, area, mizan, plotArea, floor, buildingArea, electricityMeterNo, titleDeedNo, contractStartDate, investmentStructure, gracePeriodFrom, contractEndDate, amount, gracePeriodTo, paymentScheduling, attachment, name, phoneNo, email, type:path } );
            await newEntry.save();

            res.status(200).json({ success: true, message: "Entry Added !" }) 
        }
        else if( path === 'Units'){
            const { userEmail, attachment, name, phoneNo, email, nameInBill, idNumber, expID, building, passPortNumber, expPassPort, buildingNameInArabic, buildingNameInEnglish, parkings, roof, country, city, area, electricityMeterNo, contractStartDate, investmentStructure, gracePeriodFrom, contractEndDate, amount, gracePeriodTo, paymentScheduling, unitNo, balcony, ac, unitType, unitUse, bathroom, unitStatus, plotNo, rent, rentParking, size, waterMeterNumber, sewageNumber, view, notes, path, importEntries, row } = req.body;

            let newEntry = new Units( { userEmail, attachment, name, phoneNo, email, nameInBill, idNumber, expID, building, passPortNumber, expPassPort, buildingNameInArabic, buildingNameInEnglish, parkings, roof, country, city, area, electricityMeterNo, contractStartDate, investmentStructure, gracePeriodFrom, contractEndDate, amount, gracePeriodTo, paymentScheduling, unitNo, balcony, ac, unitType, unitUse, bathroom, unitStatus, plotNo, rent, rentParking, size, waterMeterNumber, sewageNumber, view, notes, type:path } );
            await newEntry.save();

            res.status(200).json({ success: true, message: "Entry Added !" }) 
        }
        else if( path === 'NewContract'){
            const { userEmail, unitNo, buildingNameInArabic, buildingNameInEnglish, plotNo, rent, bathroom, parkings, rentParking, roof,  balcony, size,  electricityMeterNo, waterMeterNumber, sewageNumber, ac, unitType, unitUse, unitStatus, view, country, city,  area,  notes,tenant, tenantName, tenantEmail, tenantPhoneNo, tenantOpeningBalance, tenantPassPortNumber, tenantExpPassPort, tenantVatRegistrationNo, tenantIbanNo, tenantBank, tenantBankAccountNumber, tenantIdNumber, tenantExpIdNumber,newContractStartDate, newContractEndDate, newContractUnitRent, newContractCommission, newContractRentParking, newContractBouncedChequeFine, newContractStatus, newContractPaymentScheduling, newContractSecurityDeposit, newContractNotes, path, importEntries, row } = req.body;

            let newEntry = new ContractAndTenant( { userEmail, unitNo, buildingNameInArabic, buildingNameInEnglish, plotNo, rent, bathroom, parkings, rentParking, roof,  balcony, size,  electricityMeterNo, waterMeterNumber, sewageNumber, ac, unitType, unitUse, unitStatus, view, country, city,  area,  notes,tenant, tenantName, tenantEmail, tenantPhoneNo, tenantOpeningBalance, tenantPassPortNumber, tenantExpPassPort, tenantVatRegistrationNo, tenantIbanNo, tenantBank, tenantBankAccountNumber, tenantIdNumber, tenantExpIdNumber,newContractStartDate, newContractEndDate, newContractUnitRent, newContractCommission, newContractRentParking, newContractBouncedChequeFine, newContractStatus, newContractPaymentScheduling, newContractSecurityDeposit, newContractNotes, type:path } );
            await newEntry.save();

            res.status(200).json({ success: true, message: "Entry Added !" }) 
        }

        else if( path === 'ChequeTransaction'){
            const { userEmail, totalDebit , totalCredit, inputList, chequeStatus, chequeId, name, email, desc, memo, journalDate, journalNo, attachment, path } = req.body;

            let data = await ChequeTransaction.findOne({ userEmail, journalNo })
            if( data ){
                res.status(400).json({ success: false, message: "Already Found!" }) 
            }
            else{
                let newEntry = new ChequeTransaction( { userEmail, totalDebit , totalCredit, inputList, chequeStatus, chequeId, name, email, desc , memo, journalDate, journalNo, attachment, path } );
                await Cheque.findByIdAndUpdate(chequeId, {chequeStatus: chequeStatus})
                await newEntry.save();
                res.status(200).json({ success: true, message: "Entry Added !" }) 
            }
            
        }


        else{
            res.status(400).json({ success: false, message: "Internal Server Error !" }) 
        }
    }
    else{
        res.status(400).json({ success: false, message: "Internal Server Error !" }) 
    }
}