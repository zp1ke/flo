Feature: Profiles API testing

  Background:
    * def baseUrl = karate.properties['baseUrl']
    * def username = karate.properties['username']
    * header Authorization = 'Bearer ' + karate.properties['authToken']

  Scenario: Get user data
    Given url baseUrl + '/api/v1/profiles'
    When method get
    Then status 200
    And match response.code == '#string'
    And match response.profiles == '#[1]'
    And match response.profiles[0].name == username

  Scenario: Update profile data
    * def profileCode = karate.properties['profileCode']

    Given url baseUrl + '/api/v1/profiles/' + profileCode
    And request { 'name': 'Karate Test', 'avatar': 'Karate' }
    When method put
    Then status 200
    And match response.profiles == '#[1]'
    And match response.profiles[0].name == 'Karate Test'
    And match response.profiles[0].avatar == 'Karate'

  Scenario: Add profile data
    Given url baseUrl + '/api/v1/profiles'
    And request { 'name': 'Karate Test 2', 'avatar': 'Karate 2' }
    When method post
    Then status 200
    And match response.profiles == '#[2]'
    And match response.profiles[0].name == 'Karate Test'
    And match response.profiles[0].avatar == 'Karate'
    And match response.profiles[1].name == 'Karate Test 2'
    And match response.profiles[1].avatar == 'Karate 2'

  Scenario: Add profile game favorite
    * def profileCode = karate.properties['profileCode']
    * def gameCode = karate.properties['gameCode']

    Given url baseUrl + '/api/v1/profiles/' + profileCode + '/favorites/' + gameCode
    When method post
    Then status 200
    And match response.code == '#string'
    And match response.profiles == '#array'
    And match response.profiles[0].favorites == '#[1]'

  Scenario: Remove profile game favorite
    * def profileCode = karate.properties['profileCode']
    * def gameCode = karate.properties['gameCode']

    Given url baseUrl + '/api/v1/profiles/' + profileCode + '/favorites/' + gameCode
    When method delete
    Then status 200
    And match response.code == '#string'
    And match response.profiles == '#array'
    And match response.profiles[0].favorites == '#[0]'
