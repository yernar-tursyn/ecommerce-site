import React, { Component } from "react";
import { storeProducts, detailProduct } from "./data";

const ProductContext = React.createContext();

class ProductProvider extends Component {
    state = {
        products: [],
        filteredProducts: [],
        detailProduct: detailProduct,
        cart: [],
        modalOpen: false,
        modalProduct: detailProduct,
        cartSubTotal: 0,
        cartTax: 0,
        cartTotal: 0,
        searchQuery: ''
    };

    componentDidMount() {
        this.setProducts();
        this.loadCartFromLocalStorage();
    }

    setProducts = () => {
        let products = [];
        storeProducts.forEach(item => {
            const singleItem = { ...item };
            products = [...products, singleItem];
        });
        this.setState(() => {
            return { products, filteredProducts: products };
        });
    };

    saveCartToLocalStorage = () => {
        localStorage.setItem('cart', JSON.stringify(this.state.cart));
        localStorage.setItem('cartTotals', JSON.stringify({
            cartSubTotal: this.state.cartSubTotal,
            cartTax: this.state.cartTax,
            cartTotal: this.state.cartTotal
        }));
    };

    loadCartFromLocalStorage = () => {
        const cart = JSON.parse(localStorage.getItem('cart'));
        const cartTotals = JSON.parse(localStorage.getItem('cartTotals'));
        if (cart) {
            this.setState(() => {
                return {
                    cart: cart,
                    cartSubTotal: cartTotals ? cartTotals.cartSubTotal : 0,
                    cartTax: cartTotals ? cartTotals.cartTax : 0,
                    cartTotal: cartTotals ? cartTotals.cartTotal : 0
                };
            });
        }
    };

    handleSearch = (query) => {
        this.setState({
            searchQuery: query,
            filteredProducts: this.state.products.filter(product =>
                product.title.toLowerCase().includes(query.toLowerCase())
            )
        });
    };

    handleDetail = (id) => {
        const product = this.getItem(id);
        this.setState(() => {
            return { detailProduct: product };
        });
    };

    getItem = (id) => {
        const product = this.state.products.find(item => item.id === id);
        return product;
    };

    addToCart = (id) => {
        let tempProducts = [...this.state.products];
        const index = tempProducts.indexOf(this.getItem(id));
        const product = tempProducts[index];
        product.inCart = true;
        product.count = 1;
        const price = product.price;
        product.total = price;

        this.setState(() => {
            return {
                products: [...tempProducts],
                cart: [...this.state.cart, product],
                detailProduct: { ...product }
            };
        }, () => {
            this.addTotals();
            this.saveCartToLocalStorage();
        });
    };

    openModal = id => {
        const product = this.getItem(id);
        this.setState(() => {
            return { modalProduct: product, modalOpen: true };
        });
    };

    closeModal = () => {
        this.setState(() => {
            return { modalOpen: false };
        });
    };

    increment = id => {
        let tempCart = [...this.state.cart];
        const selectedProduct = tempCart.find(item => {
            return item.id === id;
        });
        const index = tempCart.indexOf(selectedProduct);
        const product = tempCart[index];
        product.count = product.count + 1;
        product.total = product.count * product.price;
        this.setState(() => {
            return {
                cart: [...tempCart]
            };
        }, () => {
            this.addTotals();
            this.saveCartToLocalStorage();
        });
    };

    decrement = id => {
        let tempCart = [...this.state.cart];
        const selectedProduct = tempCart.find(item => {
            return item.id === id;
        });
        const index = tempCart.indexOf(selectedProduct);
        const product = tempCart[index];
        product.count = product.count - 1;
        if (product.count === 0) {
            this.removeItem(id);
        } else {
            product.total = product.count * product.price;
            this.setState(() => {
                return { cart: [...tempCart] };
            }, () => {
                this.addTotals();
                this.saveCartToLocalStorage();
            });
        }
    };

    getTotals = () => {
        let subTotal = 0;
        this.state.cart.forEach(item => (subTotal += item.total));
        const tempTax = subTotal * 0.1;
        const tax = parseFloat(tempTax.toFixed(2));
        const total = subTotal + tax;
        return {
            subTotal,
            tax,
            total
        };
    };

    addTotals = () => {
        const totals = this.getTotals();
        this.setState(
            () => {
                return {
                    cartSubTotal: totals.subTotal,
                    cartTax: totals.tax,
                    cartTotal: totals.total
                };
            }
        );
    };

    removeItem = id => {
        let tempProducts = [...this.state.products];
        let tempCart = [...this.state.cart];

        const index = tempProducts.indexOf(this.getItem(id));
        let removedProduct = tempProducts[index];
        removedProduct.inCart = false;
        removedProduct.count = 0;
        removedProduct.total = 0;

        tempCart = tempCart.filter(item => {
            return item.id !== id;
        });

        this.setState(() => {
            return {
                cart: [...tempCart],
                products: [...tempProducts]
            };
        }, () => {
            this.addTotals();
            this.saveCartToLocalStorage();
        });
    };

    clearCart = () => {
        this.setState(
            () => {
                return { cart: [] };
            },
            () => {
                this.setProducts();
                this.addTotals();
                this.saveCartToLocalStorage();
            }
        );
    };

    render() {
        return (
            <ProductContext.Provider
                value={{
                    ...this.state,
                    handleSearch: this.handleSearch,
                    handleDetail: this.handleDetail,
                    addToCart: this.addToCart,
                    openModal: this.openModal,
                    closeModal: this.closeModal,
                    increment: this.increment,
                    decrement: this.decrement,
                    removeItem: this.removeItem,
                    clearCart: this.clearCart
                }}
            >
                {this.props.children}
            </ProductContext.Provider>
        );
    }
}

const ProductConsumer = ProductContext.Consumer;

export { ProductProvider, ProductConsumer };
