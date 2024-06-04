import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import newLogo from '../img/logoHorest.png';
import styled from 'styled-components';
import { ButtonContainer } from './Button';
import { ProductConsumer } from '../context';

export default class Navbar extends Component {
  state = {
    searchQuery: ''
  };

  handleInputChange = (event, handleSearch) => {
    const query = event.target.value;
    this.setState({ searchQuery: query });
    handleSearch(query); // Обновляем результаты поиска в реальном времени
  };

  handleSearch = (event, handleSearch) => {
    event.preventDefault();
    handleSearch(this.state.searchQuery);
  };

  render() {
    return (
      <ProductConsumer>
        {value => {
          return (
            <NavWrapper className="navbar navbar-expand-sm navbar-dark px-sm-5">
              <Link to='/' className="navbar-brand">
                <Logo src={newLogo} alt="store" />
              </Link>
              <ul className="navbar-nav align-items-center">
                <li className="nav-item ml-5">
                  <Link to="/" className="nav-link">
                    Главная
                  </Link>
                </li>
                <li className="nav-item ml-5">
                  <Link to="/3d-design" className="nav-link">
                    3D Дизайн
                  </Link>
                </li>
                <li className="nav-item ml-5">
                  <Link to="/business" className="nav-link">
                    Для бизнеса
                  </Link>
                </li>
                <li className="nav-item ml-5">
                  <Link to="/delivery" className="nav-link">
                    Доставка
                  </Link>
                </li>
                <li className="nav-item ml-5">
                  <Link to="/about" className="nav-link">
                    О нас
                  </Link>
                </li>
                <li className="nav-item ml-5">
                  <Link to="/reviews" className="nav-link">
                    Отзывы
                  </Link>
                </li>
                <li className="nav-item ml-5">
                  <Link to="/contacts" className="nav-link">
                    Контакты
                  </Link>
                </li>
              </ul>
              <SearchContainer>
                <form onSubmit={(event) => this.handleSearch(event, value.handleSearch)}>
                  <input
                    type="text"
                    className="search-input"
                    placeholder="Search for products"
                    value={this.state.searchQuery}
                    onChange={(event) => this.handleInputChange(event, value.handleSearch)}
                  />
                  <ButtonContainer type="submit">
                    Search
                  </ButtonContainer>
                </form>
              </SearchContainer>
              <Link to="/cart" className="ml-auto">
                <ButtonContainer>
                  <i className="fas fa-cart-plus"> my cart</i>
                </ButtonContainer>
              </Link>
            </NavWrapper>
          );
        }}
      </ProductConsumer>
    );
  }
}

const NavWrapper = styled.nav`
  background: #181824;
  .nav-link {
    color: var(--mainWhite) !important;
    font-size: 1.3rem;
    text-transform: capitalize;
  }
`;

const Logo = styled.img`
  height: 50px;
  width: auto;
`;

const SearchContainer = styled.div`
  display: flex;
  align-items: center;
  margin-left: auto;
  .search-input {
    padding: 0.5rem;
    font-size: 1rem;
    border: 1px solid var(--mainBlue);
    border-radius: 5px;
    margin-right: 0.5rem;
  }
`;
