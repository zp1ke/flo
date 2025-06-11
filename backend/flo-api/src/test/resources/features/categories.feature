Feature: Categories API testing

  Background:
    * def baseUrl = karate.properties['baseUrl'] + '/api/v1/profiles/' + karate.properties['profileCode'] + '/categories'
    * header Authorization = 'Bearer ' + karate.properties['authToken']

  Scenario: Add category data
    Given url baseUrl
    And request { 'name': 'main category' }
    When method post
    Then status 201
    And match response.code == '#string'
    And match response.name == 'main category'

  Scenario: Get profile categories
    Given url baseUrl
    When method get
    Then status 200
    And match response.list == '#[2]'
    And match response.list[0].code == '#string'
    And match response.list[0].name == 'main category'

  Scenario: Add duplicated category data
    Given url baseUrl
    And request { 'name': 'main category' }
    When method post
    Then status 400
    And match response.message == 'category.name-duplicate'
