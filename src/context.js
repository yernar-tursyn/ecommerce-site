import React, { Component } from "react";

const ProductContext = React.createContext();

class ProductProvider extends Component {
    state = {
        products: [],
        filteredProducts: [],
        detailProduct: {},
        cart: [],
        modalOpen: false,
        modalProduct: {},
        cartSubTotal: 0,
        cartTax: 0,
        cartTotal: 0,
        searchQuery: ''
    };

    componentDidMount() {
        this.getProducts();
        this.getCart();
    }

    getProducts = async () => {
        const response = await fetch('http://localhost:5000/api/products');
        const products = await response.json();
        this.setState({ products, filteredProducts: products });
    };

    getCart = async () => {
        const response = await fetch('http://localhost:5000/api/cart');
        const cart = await response.json();
        console.log("Loaded cart from server:", cart); // Log the loaded cart
        this.setState({ cart }, this.addTotals);
    };

    saveCartToLocalStorage = () => {
        localStorage.setItem('cart', JSON.stringify(this.state.cart));
        localStorage.setItem('cartTotals', JSON.stringify({
            cartSubTotal: this.state.cartSubTotal,
            cartTax: this.state.cartTax,
            cartTotal: this.state.cartTotal
        }));
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

    addToCart = async (id) => {
        const product = this.getItem(id);
        const response = await fetch('http://localhost:5000/api/cart', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(product)
        });
        const cartProduct = await response.json();
        console.log("Added to cart:", cartProduct); // Log the added product
        this.setState(
            (prevState) => {
                const updatedProducts = prevState.products.map(p =>
                    p.id === id ? { ...p, inCart: true } : p
                );
                const updatedCart = [...prevState.cart];
                const productInCart = updatedCart.find(item => item.id === cartProduct.id);
                if (productInCart) {
                    productInCart.count += 1;
                    productInCart.total = productInCart.count * productInCart.price;
                } else {
                    updatedCart.push(cartProduct);
                }
                return {
                    products: updatedProducts,
                    cart: updatedCart,
                    detailProduct: { ...product, inCart: true }
                };
            },
            () => {
                this.addTotals();
                this.saveCartToLocalStorage();
            }
        );
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

    increment = async (id) => {
        const product = this.state.cart.find(item => item.id === id);
        const response = await fetch(`http://localhost:5000/api/cart/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ count: product.count + 1 })
        });
        const updatedProduct = await response.json();
        this.setState(
            (prevState) => {
                const updatedCart = prevState.cart.map(p =>
                    p.id === id ? updatedProduct : p
                );
                return { cart: updatedCart };
            },
            () => {
                this.addTotals();
                this.saveCartToLocalStorage();
            }
        );
    };

    decrement = async (id) => {
        const product = this.state.cart.find(item => item.id === id);
        if (product.count > 1) {
            const response = await fetch(`http://localhost:5000/api/cart/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ count: product.count - 1 })
            });
            const updatedProduct = await response.json();
            this.setState(
                (prevState) => {
                    const updatedCart = prevState.cart.map(p =>
                        p.id === id ? updatedProduct : p
                    );
                    return { cart: updatedCart };
                },
                () => {
                    this.addTotals();
                    this.saveCartToLocalStorage();
                }
            );
        } else {
            this.removeItem(id);
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

    removeItem = async (id) => {
        await fetch(`http://localhost:5000/api/cart/${id}`, {
            method: 'DELETE'
        });
        this.setState(
            (prevState) => {
                const updatedProducts = prevState.products.map(p =>
                    p.id === id ? { ...p, inCart: false } : p
                );
                const updatedCart = prevState.cart.filter(item => item.id !== id);
                return {
                    products: updatedProducts,
                    cart: updatedCart
                };
            },
            () => {
                this.addTotals();
                this.saveCartToLocalStorage();
            }
        );
    };

    clearCart = async () => {
        await fetch('http://localhost:5000/api/cart', {
            method: 'DELETE'
        });
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
                    getProducts: this.getProducts,
                    getCart: this.getCart,
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
