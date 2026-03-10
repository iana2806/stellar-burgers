describe('Проверяем доступность приложения', () => {
  it('приложение открывается', () => {
    cy.visit('http://localhost:4000/');
  });
});

describe('Проверяем конструктор бургера', () => {
  beforeEach(() => {
    // перехват запросов к бэкенду
    cy.intercept('GET', '**/api/ingredients', { fixture: 'ingredients.json' });
    cy.intercept('GET', '**/api/auth/user', { fixture: 'user.json' });
    cy.intercept('POST', '**/api/orders', { fixture: 'order.json' });

    cy.visit('http://localhost:4000/');
  });

  // Добавление ингредиента из списка ингредиентов в конструктор
  describe('Проверяем добавление ингредиентов', () => {
    it('добавляет булку и начинку в конструктор', () => {
      cy.contains('Краторная булка N-200i')
        .parent()
        .contains('Добавить')
        .click();

      cy.contains('Мясо бессмертных моллюсков Protostomia')
        .parent()
        .contains('Добавить')
        .click();

      cy.get('[data-cy=constructor]').should(
        'contain.text',
        'Краторная булка N-200i'
      );
      cy.get('[data-cy=constructor]').should(
        'contain.text',
        'Мясо бессмертных моллюсков Protostomia'
      );
    });
  });

  // Открытие и закрытие модального окна с описанием ингредиента
  describe('Проверям модальное окно ингредиента', () => {
    it('открывает модальное окно ингредиента', () => {
      cy.contains('Краторная булка N-200i').click();

      cy.contains('Детали ингредиента').should('exist');
      cy.contains('Краторная булка N-200i').should('exist');
    });

    it('закрывает модальное окно по крестику', () => {
      cy.contains('Краторная булка N-200i').click();

      cy.get('[data-cy=modal-close]').click();

      cy.contains('Детали ингредиента').should('not.exist');
    });

    it('закрывает модальное окно по оверлею', () => {
      cy.contains('Краторная булка N-200i').click();

      cy.get('body').click(0, 0);

      cy.contains('Детали ингредиента').should('not.exist');
    });
  });

  // Процесс создания заказа
  describe('Проверяем процесс создания заказа', () => {
    // подстановка токенов
    beforeEach(() => {
      cy.setCookie('accessToken', 'test-token');
      localStorage.setItem('refreshToken', 'test-token');

      cy.intercept('POST', '**/api/orders', { fixture: 'order.json' });
    });

    // очистка токенов
    afterEach(() => {
      cy.clearCookies();
      localStorage.clear();
    });

    it('создаёт заказ', () => {
      // добавляем булку
      cy.contains('Краторная булка N-200i')
        .parent()
        .contains('Добавить')
        .click();

      // добавляем начинку
      cy.contains('Мясо бессмертных моллюсков Protostomia')
        .parent()
        .contains('Добавить')
        .click();

      // оформляем заказ
      cy.contains('Оформить заказ').click();

      // проверяем номер заказа
      cy.contains('123456').should('exist');

      // закрываем модалку
      cy.get('[data-cy=modal-close]').click();

      // проверяем, что конструктор очистился
      cy.get('[data-cy=constructor]').should(
        'not.contain.text',
        'Мясо бессмертных моллюсков Protostomia'
      );
    });
  });
});
