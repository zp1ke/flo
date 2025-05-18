Feature: Transactions API testing

  Background:
    * def baseUrl = karate.properties['baseUrl'] + '/api/v1/profiles/' + karate.properties['profileCode'] + '/transactions'
    * header Authorization = 'Bearer ' + karate.properties['authToken']
    * def mainCategoryCode = karate.properties['mainCategoryCode']
    * def mainWalletCode = karate.properties['mainWalletCode']
    * def todayDate = karate.properties['todayDate']

  Scenario: Add transaction data
    Given url baseUrl
    And request { 'amount': 10, 'categoryCode': '#(mainCategoryCode)', 'walletCode': '#(mainWalletCode)' }
    When method post
    Then status 201
    And match response.code == '#string'

  Scenario: Get profile transactions
    Given url baseUrl
    When method get
    Then status 200
    And match response.totalElements == 1
    And match response.list == '#[1]'
    And match response.list[0].amount == 10
    And match response.list[0].categoryCode == mainCategoryCode
    And match response.list[0].walletCode == mainWalletCode

  Scenario: Add another transaction data
    Given url baseUrl
    And request { 'amount': -5, 'categoryCode': '#(mainCategoryCode)', 'walletCode': '#(mainWalletCode)' }
    When method post
    Then status 201
    And match response.code == '#string'

  Scenario: Get profile stats
    Given url baseUrl + '/stats'
    And param from = todayDate
    And param to = todayDate
    When method get
    Then status 200
    And match response.income == 10
    And match response.outcome == -5
    And match response.balance == 5
    And match response.categories == '#[1]'
    And match response.categories[0].code == mainCategoryCode
    And match response.categories[0].income == 10
    And match response.categories[0].outcome == -5
    And match response.categories[0].balance == 5
    And match response.wallets[0].code == mainWalletCode
    And match response.wallets[0].income == 10
    And match response.wallets[0].outcome == -5
    And match response.wallets[0].balance == 5
    And match response.transactions == '#[2]'
