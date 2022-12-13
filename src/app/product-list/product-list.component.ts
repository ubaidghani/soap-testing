import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';

import { products } from '../products';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent {

  products = [...products];
  jsonResponse: any;
  textContent: any;
  endResult: any;
  validField = false;
  xmlRequest:any;

  soapCall(xml:any) {
    debugger;
    const parser = require('xml-js');
    const xmlhttp = new XMLHttpRequest();
    xmlhttp.open('POST', 'https://epayment.ptcl.net.pk/ebilling-services/ebilling?xsd=1', true);

    // The following variable contains the xml SOAP request.
    const sr = xml;

    xmlhttp.onreadystatechange = () => {
      if (xmlhttp.readyState == 4) {
        if (xmlhttp.status == 200) {
          const xml = xmlhttp.responseXML;
          // Here I'm getting the value contained by the <return> node.
          //const res = parser.xml2json(xml);
          //const { person } = res.root;
          // Print result square number.
          var res = xml;
          console.log(res);
          this.jsonResponse = res?.getElementsByTagName("return");
          console.log(this.jsonResponse);
          this.textContent = this.jsonResponse[0].textContent;
          console.log(this.textContent);
          var transactionId = this.textContent.substring(
            this.textContent.indexOf("<transactionid>") + 15,
            this.textContent.lastIndexOf("</transactionid>")
          );
          var paymentPage = this.textContent.substring(
            this.textContent.indexOf("<paymentpage>") + 13,
            this.textContent.lastIndexOf("</paymentpage>")
          );
          console.log(transactionId);
          //                this.endResult = parser.xml2json(this.textContent, {compact: true, spaces: 4});
          console.log(this.endResult);
          //window.location.href = 'https://ipg.comtrust.ae/Payment';
          this.postPaymentUrl(paymentPage, transactionId, 'post');
        }
      }
    }
    // Send the POST request.
    xmlhttp.setRequestHeader('Content-Type', 'text/xml');
    xmlhttp.responseType = 'document';
    xmlhttp.send(sr);
  }

  postPaymentUrl(path: any, transactionId: any, method: any) {

    var form = document.createElement('form');
    form.setAttribute('method', method);
    form.setAttribute('action', path);
    var hiddenField = document.createElement('input');
    hiddenField.setAttribute('type', 'hidden');
    hiddenField.setAttribute('name', 'TransactionID');
    hiddenField.setAttribute('value', transactionId);

    form.appendChild(hiddenField);
    document.body.appendChild(form);
    form.submit();
  }

  share() {
    window.alert('The product has been shared!');
  }

  onNotify() {
    window.alert('You will be notified when the product goes on sale');
  }

  onSubmit(myForm: NgForm) {
    debugger;
    console.log(myForm.value);
    console.log(myForm.valid);
    if(!myForm.valid) {
      this.validField = true;
    } else {
      this.createXmlRequest(myForm.value);
      this.soapCall(this.xmlRequest)
    }
      
  }

  createXmlRequest(request:any) {
    this.xmlRequest = `<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:ser="http://service.ebilling.ptcl.org/">
    <soapenv:Header/>
    <soapenv:Body>
        <ser:processTrans>
            <xmlValue>
                <![CDATA[<ebpacket><head><packettype>EbRegistrationForGuest</packettype><staffcode>SPA</staffcode><pwd>SVF64^MM%^2021^^HJDJ</pwd><env>PROD</env></head><body>
                
                <name>`+ request.name +`</name>
                <email>`+ request.email +`</email>
                <cellno>`+ request.Cellno +`</cellno>
                <cnic>`+ request.cnic +`</cnic>
                
                <NadraCRMTransId>1455952</NadraCRMTransId><totalamount>2720</totalamount><amount>950</amount><ordername>Land line bill</ordername><orderinfo>0512230388</orderinfo><orderinfo2>2100000783</orderinfo2><orderinfo3>10829801312000</orderinfo3><servicetype>Friend Bill</servicetype><producttype>postpaid</producttype><ip>10.254.150.64 </ip><deviceid>10.254.150.64 </deviceid><appreturnpath>https://www.google.com</appreturnpath><billtype>Partially Paid</billtype><recurrencepayment>0</recurrencepayment></body></ebpacket>]]>                
    
    
    
    </xmlValue>
</ser:processTrans>
</soapenv:Body>
</soapenv:Envelope>
`;
  }


  resetFormValue(myForm: NgForm){
    myForm.resetForm()
  }
}



