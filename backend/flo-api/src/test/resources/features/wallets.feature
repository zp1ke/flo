Feature: Wallets API testing

  Background:
    * def baseUrl = karate.properties['baseUrl'] + '/api/v1/profiles/' + karate.properties['profileCode'] + '/wallets'
    * header Authorization = 'Bearer ' + karate.properties['authToken']

  Scenario: Add wallet data
    Given url baseUrl
    And request { 'name': 'main wallet' }
    When method post
    Then status 201
    And match response.code == '#string'
    And match response.name == 'main wallet'

  Scenario: Get profile wallets
    Given url baseUrl
    When method get
    Then status 200
    And match response.list == '#[2]'
    And match response.list[0].name == '#string'
    And match response.list[0].name == 'main wallet'

  Scenario: Add duplicated wallet data
    Given url baseUrl
    And request { 'name': 'main wallet' }
    When method post
    Then status 400
    And match response.message == 'wallet.name-duplicate'
