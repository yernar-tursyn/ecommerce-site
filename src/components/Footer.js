import React from 'react';
import styled from 'styled-components';

export default function Footer() {
  return (
    <FooterWrapper>
      <div className="container py-3">
        <div className="row">
          <div className="col-md-4 col-sm-12">
            <h5>О нас</h5>
            <p>
              Мы предлагаем лучшие продукты для вашего бизнеса и личного использования.
            </p>
          </div>
          <div className="col-md-4 col-sm-12">
            <h5>Контакты</h5>
            <p>
              <i className="fas fa-map-marker-alt"></i> Адрес: Москва, Россия
            </p>
            <p>
              <i className="fas fa-phone"></i> Телефон: +7 123 456 7890
            </p>
            <p>
              <i className="fas fa-envelope"></i> Email: info@example.com
            </p>
          </div>
          <div className="col-md-4 col-sm-12">
            <h5>Подписка</h5>
            <p>
              Подпишитесь на наши новости и предложения:
            </p>
            <form>
              <input type="email" className="form-control" placeholder="Ваш email" />
              <button type="submit" className="btn btn-primary mt-2">Подписаться</button>
            </form>
          </div>
        </div>
      </div>
      <div className="footer-bottom text-center py-3">
        &copy; {new Date().getFullYear()} Все права защищены.
      </div>
    </FooterWrapper>
  );
}

const FooterWrapper = styled.footer`
  background: #343a40;
  color: #fff;
  .footer-bottom {
    background: #23272b;
  }
  a {
    color: #fff;
    text-decoration: none;
  }
  a:hover {
    color: #ffc107;
  }
  .container {
    max-width: 1200px;
  }
`;
