import React from "react";
import PaymentHistory from "./PaymentHistory";

class DebtCalcApp extends React.Component{

    constructor(params) {
        super();
        this.state = {
            debt: "-",
            debtInput: "",
            intInput: "",
            interestRate: 0,
            minPayment:"-",
            principal: "-",
            principalPaid:"-",
            interest: "-",
            paymentList: [],
            totalPaymentInput: "",
            totalPayment: 0,
            paymentsLeft: "-",
        }
        
    }

    stringToNum = (str) => {
        return str === '' ? 0 : Number(parseFloat(str).toFixed(2))
    }
    calculateInterest = (debt, interestRate) => {
        return Number((((interestRate*10**-2)/12) * debt).toFixed(2));
    }
    calculteInitialPrincipal(debt){
        return this.stringToNum((debt * .01))
    }

    calculateMinPayment = (debt, interest) => {
        let interestCalc = this.calculateInterest(debt, interest);
        const principal = debt * .01;
        const sum = interestCalc + principal

        return this.stringToNum(sum);
    }
    calculatePrincipalPaid = (payment, interest) => {
        return this.stringToNum(payment - interest);
    }

    // USER INPUT FIELDS--------------------------------------

    handleChange = (e) => this.setState({[e.target.name]: e.target.value});

    handleTotalPayChange = (e) => this.setState({totalPaymentInput: e.target.value});
    

    handleDebtSubmit = (event) => {
        const {debtInput, intInput, totalPaymentInput,} = this.state

        event.preventDefault();
            this.setState({
                debt: this.stringToNum(debtInput),
                balance: this.stringToNum(debtInput),
                interestRate: this.stringToNum(intInput),
                totalPayment: this.stringToNum(totalPaymentInput),
            },() => {
                this.afterSetState(); 
            });
       
    } 
    afterSetState = () => { 
        const {interestRate, debt} = this.state
        const interest = this.calculateInterest(debt, interestRate)
        const minPayment = this.calculateMinPayment(debt, interestRate);
        const principalPaid = this.calculatePrincipalPaid(minPayment, interest);
        const paymentsLeft = this.stringToNum((debt / minPayment))

        this.setState({
            interest: interest,
            principalPaid :principalPaid,
            minPayment: minPayment,     
            paymentsLeft: Math.round(paymentsLeft),
        })

    }


    handleTotalPayment = (event) => {
        const {debt, interest, balance, minPayment} = this.state
        const totalPayment = this.stringToNum(this.state.totalPaymentInput)
 
        event.preventDefault();
        if(totalPayment < (+minPayment) && balance > +minPayment){
            alert('Does not meet minimum payment requirements')
        }
        else if(isNaN(debt)){
            alert('Please enter debt amount')
        }
        else if(isNaN(interest)){
            alert('Please enter interest amount')
        }
        else if(this.state.balance <= +this.state.totalPaymentInput)
        { this.setState((prev)=> ({
            minPayment: 0,
            balance: 0,
            principalPaid: 0,
            paymentsLeft: 0
        }));
        console.log('fireA')} 
        else
        {
            
            this.setState({
                totalPayment: totalPayment
            },() => {
                this.afterSetStatePay(); // updates that need debt and interestRate to complete before executing
            });
        }
    }
    afterSetStatePay = () => { 
        const {totalPayment, balance, interestRate, interest} = this.state
            const principalPaid = totalPayment - interest;
            this.setState((prev) => ({
                balance: this.stringToNum(((prev.balance) - (principalPaid))),
            }))
            const newPayment = {
                interest: this.calculateInterest(balance, interestRate),
                principalPaid: this.calculatePrincipalPaid(totalPayment, interest),
                balance: balance,
                totalPayment:totalPayment,
            }
            this.state.paymentList.push(newPayment)
      }



    componentDidUpdate(prevProps, prevState){
        const { balance, interestRate, totalPayment } = this.state;
        let paymentsLeft = Math.round(this.stringToNum((balance / this.state.minPayment)))
        const interest = this.calculateInterest(balance, interestRate)
        
        if(paymentsLeft <= 0){
            paymentsLeft = 0
            console.log('FireC')
        }
        //executes before async setstate
        // console.log('fire')
        // console.log(balance)
        // console.log(this.state.minPayment)
        // console.log(paymentsLeft)
        // console.log(interest)

        if(this.state.balance !== prevState.balance){
            this.setState((prev) => ({
                interest: this.calculateInterest(balance, interestRate),
                paymentsLeft: Math.round(paymentsLeft),
                principalPaid: this.calculatePrincipalPaid(totalPayment, interest),
            }))
            if(balance <= 100){
                console.log('balance <= 100')
                const p = this.stringToNum((balance * .01) - interest)
                this.setState((prev)=> ({
                    // minPayment: balance + p,
                    totalPayment: p,
                    principalPaid: 0,
                    
                }))
                console.log(balance)
                console.log(balance * .01);
                console.log(interest)
                console.log(p)

            }
            if(paymentsLeft >= prevState.paymentsLeft){
                console.log('fireB')
                const p = this.stringToNum(prevState.paymentsLeft - 1)
                this.setState((prev) => (
                    {
                        paymentsLeft: p,
                    }
                ))
            }
            
           
        }


    }; 
    
    render(){
        const initialInput = [
            {key: 0, name: 'debt'},
            {key: 1, name: 'int'},
        ];
        const calcData = [
            {key: 0, name: 'Balance', stateName: 'balance'},
            {key: 1, name: 'Minimum Payment', stateName: 'minPayment'},
            {key: 2, name: 'Interest', stateName: 'interest'},
            {key: 3, name: 'Principle', stateName: 'principalPaid'},
            {key: 4, name: 'Min. Payments remaining', stateName: 'paymentsLeft'},
        ]
        return(

            <div className="form-wrapper">
                <h1>Debt Calculator</h1>
                <form className="user-debt-input" onSubmit={this.handleDebtSubmit}>
                    {initialInput.map(input => 
                        <div key={input.key}>
                            <label>{input.name[0].toUpperCase() + input.name.substring(1)}:</label>
                            <br />
                            <input
                                className="base-input-field" 
                                type="text"
                                name={`${input.name}Input`}
                                onChange={this.handleChange}
                                value={this.state[`${input.name}Input`]}/>
                        </div>
                    )}

                    <div>
                        <input className="btn"  type="submit" onClick={this.handleDebtSubmit} value="Submit" />
                    </div>
                </form>
                <br />
                <div className="payment-info-wrapper">
                    <div className="make-payment-wrapper">
                        <h2>Payment</h2>
                        <form action="make-payment-input">
                            <div>
                                <label>Enter Amount: </label>
                                <br />
                                <input
                                    className="base-input-field" 
                                    type="text"
                                    onChange={this.handleTotalPayChange}
                                    value={this.state.totalPaymentInput}/>
                                    <br />
                            </div>
                            <div>
                                <input className="btn" type="submit" onClick={this.handleTotalPayment} value="Make Payment" />
                            </div>
                        </form>                        
                    </div>
                    <div className="next-payment-wrapper">
                        <h2>Next Payment</h2>
                        {calcData.map(item => 
                            <div key={item.key} className="next-payment-child">
                                <strong>{item.name}:</strong>  {this.state[`${item.stateName}`]}
                            </div>
                        )}  
                    </div> 
                    
                </div>

                 <PaymentHistory paymentList={this.state.paymentList}/>
            </div>
        )
    }  

}
export default DebtCalcApp