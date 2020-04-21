import React, { Component } from 'react';
import { Template } from '../../components';
import { connect } from 'react-redux';
import { SERVER_IP } from '../../private';
import './orderForm.css';

const ADD_ORDER_URL = `${SERVER_IP}/api/add-order`;
const EDIT_ORDER_URL = `${SERVER_IP}/api/edit-order`;

const mapStateToProps = (state) => ({
    auth: state.auth,
})

class OrderForm extends Component {
    state = {
        order: {
            order_item: "",
            quantity: "1"
        }
    }

    componentDidMount() {
        this.loadOrder(this.props.match.params.id);
    }

    componentDidUpdate(prevProps) {
        if (this.props.match.params.id !== prevProps.match.params.id) {
            this.loadOrder(this.props.match.params.id);
        }
    }

    loadOrder(orderId) {
        if (orderId) {
            fetch(`${SERVER_IP}/api/current-orders`)
                .then(response => response.json())
                .then(response => {
                    if(response.success) {
                        const order = response.orders.find(a => a._id === orderId);
                        this.setState({ order });
                    } else {
                        console.log('Error getting orders');
                    }
                });
        }
        else {
            this.setState({
                order: {
                    order_item: "",
                    quantity: "1"
                }
            });
        }
    }

    menuItemChosen(event) {
        this.setState({
            order: {
                ...this.state.order,
                order_item: event.target.value
            }
        });
    }

    menuQuantityChosen(event) {
        this.setState({
            order: {
                ...this.state.order,
                quantity: event.target.value
            }
        });
    }

    postOrder(url, payload) {
        return fetch(url, {
            method: 'POST',
            body: JSON.stringify(payload),
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(res => res.json())
        .then(response => console.log("Success", JSON.stringify(response)))
        .catch(error => console.error(error));
    }

    submitOrder(event) {
        event.preventDefault();
        if (this.state.order_item === "") return;
        const orderObject = {
            order_item: this.state.order.order_item,
            quantity: this.state.order.quantity,
            ordered_by: this.state.order.ordered_by || this.props.auth.email || 'Unknown!',
        };
        if (this.state.order._id) {
            this.postOrder(EDIT_ORDER_URL, {...orderObject, id: this.state.order._id});
        }
        else {
            this.postOrder(ADD_ORDER_URL, orderObject);
        }
    }

    render() {
        return (
            <Template>
                <div className="form-wrapper">
                    <form>
                        <label className="form-label">
                            { this.state.order._id ? `Edit Order: ${this.state.order._id}` : 'I\'d like to order...'}
                        </label>
                        <br />
                        <select 
                            value={this.state.order.order_item} 
                            onChange={(event) => this.menuItemChosen(event)}
                            className="menu-select"
                        >
                            <option value="" defaultValue disabled hidden>Lunch menu</option>
                            <option value="Soup of the Day">Soup of the Day</option>
                            <option value="Linguini With White Wine Sauce">Linguini With White Wine Sauce</option>
                            <option value="Eggplant and Mushroom Panini">Eggplant and Mushroom Panini</option>
                            <option value="Chili Con Carne">Chili Con Carne</option>
                        </select><br />
                        <label className="qty-label">Qty:</label>
                        <select value={this.state.order.quantity} onChange={(event) => this.menuQuantityChosen(event)}>
                            <option value="1">1</option>
                            <option value="2">2</option>
                            <option value="3">3</option>
                            <option value="4">4</option>
                            <option value="5">5</option>
                            <option value="6">6</option>
                        </select>
                        <button type="button" className="order-btn" onClick={(event) => this.submitOrder(event)}>
                            { this.state.order._id ? 'Save' : 'Order It!'}
                        </button>
                    </form>
                </div>
            </Template>
        );
    }
}

export default connect(mapStateToProps, null)(OrderForm);