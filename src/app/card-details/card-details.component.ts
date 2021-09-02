import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
// @ts-ignore
import * as $ from 'jquery';
@Component({
  selector: 'app-card-details',
  templateUrl: './card-details.component.html',
  styleUrls: ['./card-details.component.css']
})
export class CardDetailsComponent implements OnInit {
  detailsForm: any;
  regexMap = [
    {regEx: /^4[0-9]{5}/ig,cardType: "VISA"},
    {regEx: /^5[1-5][0-9]{4}/ig,cardType: "MASTERCARD"},
    {regEx: /^3[47][0-9]{3}/ig,cardType: "AMEX"},
    {regEx: /^(5[06-8]\d{4}|6\d{5})/ig,cardType: "MAESTRO"}
  ];
  constructor(private fb: FormBuilder) { }

  ngOnInit(): void {
    this.detailsForm = this.fb.group({
      name: ['', [Validators.required]],
      cardNumber: ['', [Validators.required]],
      cvv: ['', [Validators.required]],
      expiry: ['', [Validators.required]],
    });
    $(".credit-card-box").css('background-image', 'url(' + 'assets/images/6.jpeg' +')');
  }

  apply() {
    console.log('Valid');
  }

  updateCardDetails(event: any, formControlName: String) {
    switch(formControlName) {
      case 'cardNumber':
        // let cardType = $(".credit-card-box .logo").;
        let cardNumber = this.detailsForm.get('cardNumber').value;
        cardNumber = cardNumber.replace(/\s/g, '');
        let formattedNumber = ''
        for (let i=0; i<cardNumber.length; i++) {
          if (i%4 === 0 && i > 0) {
            formattedNumber = formattedNumber.concat(' ');
          }
          formattedNumber = formattedNumber.concat(cardNumber[i]);
        }
        $(".credit-card-box .number-text").html(formattedNumber);
        $('#card-number').val(formattedNumber)
        // this.detailsForm.get('cardNumber').value = formattedNumber;
        // $("#card-number").value(formattedNumber);
        const cardType = this.getCardType(cardNumber);
        this.changeCardLogo(cardType);
        if (cardNumber.length === 16) {
          $('#card-holder').focus();
          break;
        }
        break;
      case 'name':
        $(".credit-card-box .card-holder .holder-name").html(this.detailsForm.get('name').value);
        break;
      case 'cvv':
        $(".credit-card-box .ccv div").html(this.detailsForm.get('cvv').value);
        break;
    }

  }

  toggleCard(showBack: Boolean) {
    if (showBack) {
      $(".credit-card-box").addClass("hover");
    } else {
      $(".credit-card-box").removeClass("hover");
    }
  }

  changeCardLogo(cardType: string) {
    switch(cardType) {
      case 'VISA':
        $(".logoImage").attr("src", "assets/images/mastercard.png");
        break;
      case 'MASTERCARD':
        $(".logoImage").attr("src", "assets/images/mastercard.png");
        break;
      case 'AMEX':
        $(".logoImage").attr("src", "assets/images/amex.png");
        break;
      case 'MAESTRO':
        $(".logoImage").attr("src", "assets/images/maestro.png");
        break;
      case 'RUPAY':
        $(".logoImage").attr("src", "assets/images/rupay.png");
        break;
    }
  }

  getCardType(cardNum: String) {
    var payCardType = "";
    for (var j = 0; j < this.regexMap.length; j++) {
      if (cardNum.match(this.regexMap[j].regEx)) {
        payCardType = this.regexMap[j].cardType;
        break;
      }
    }

    if (cardNum.indexOf("50") === 0 || cardNum.indexOf("60") === 0 || cardNum.indexOf("65") === 0) {
      var g = "508500-508999|606985-607984|608001-608500|652150-653149";
      var i = g.split("|");
      for (var d = 0; d < i.length; d++) {
        var c = parseInt(i[d].split("-")[0], 10);
        var f = parseInt(i[d].split("-")[1], 10);
        if (parseInt(cardNum.substr(0, 6)) >= c && parseInt(cardNum.substr(0, 6)) <= f && cardNum.length >= 6) {
         payCardType = "RUPAY";
          break;
        }
      }
    }
    return payCardType;
  }

  updateExpirydateMonth() {
    let m = $("#card-expiration-month").val();
    $(".card-expiration-date .month").html(m);
    $('#card-expiration-year').focus();

  }

  updateExpirydateYear() {
    let y = $("#card-expiration-year").val();
    $(".card-expiration-date .year").html(y);
    $('#card-ccv').focus();
  }

  focusCreditCardElements(className: string, focus: boolean, formElement?: string) {
    focus ? $('.' + className).addClass('borderClass') : $('.' + className).removeClass('borderClass');
    focus ? $('.' + formElement).addClass('inputFocusBorder') : $('.' + formElement).removeClass('inputFocusBorder');
  }

  onKeyPressCardNumber(event:any) {
    const cardNumber = this.detailsForm.get('cardNumber').value;
    if (event.charCode === 13 && cardNumber.length === 19) {
      $('#card-holder').focus();
    }
    this.inputOnlynumbers(event);
  }

  onKeyPressCardHolder(event:any) {
    const cardName = this.detailsForm.get('name').value;
    if (event.charCode === 13 && cardName.length > 0) {
      $('#card-expiration-month').focus();
    }
    this.inputOnlyLetters(event);
  }
  inputOnlynumbers(event: any) {
    if (!(/^[0-9 ]*$/.test(event.key))) {
      event.preventDefault();
    }
  }

  inputOnlyLetters(event: any) {
    if (!(/^[A-Za-z ]*$/.test(event.key))) {
      event.preventDefault();
    }
  }
  

}
