Feature: Authentication API testing

  Background:
    * def baseUrl = karate.properties['baseUrl'] + '/api/v1/auth'
    * def user = { 'email': 'test-user@flo.com', 'password': '12345678' }

  Scenario: Signup a user creates a user
    Given url baseUrl + '/sign-up'
    And request user
    When method post
    Then status 201
    And match response.token == '#string'
    And match response.user != null
    And match response.user.username == 'test-user'
    And match response.user.email == user.email
