import React, { Component } from 'react'


export class PaymentHistory extends Component {
    constructor(props) {
      super(props)
    
      this.state = {
         
      }
    }

// listPayments = () => {
//   const items = this.props.paymentList;
//   const listItems = items.map((item, index) => {
//     return <tr key={index}> 
//           <td>{index+1}</td>
//           <td>{item.balance}</td>
//           <td>{item.interest}</td>
//           <td>{item.principalPaid}</td>
//           <td>{item.totalPayment}</td>    
//       </tr>
//   })
//     return <tbody>{listItems}</tbody>

// }
  render() {
    const items = this.props.paymentList;
    return (
        
        <div className='payment-hist-wrapper'>
            <h3>Payment History</h3>
            <table className='pay-table'>
              <thead>
                <tr className='headers-row'>
                  <th>Payment #</th>
                  <th>Balance</th>
                  <th>Interest</th>
                  <th>Principal</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item, index) => 
                  <tr key={index}> 
                    <td>{index+1}</td>
                    <td>{item.balance}</td>
                    <td>{item.interest}</td>
                    <td>{item.principalPaid}</td>
                    <td>{item.totalPayment}</td>    
                  </tr>
                )}
              </tbody>

            </table>
        </div>
    )
  }
}

export default PaymentHistory