from random import randint
import sys
import json 
# import zerorpc

'''
c = zerorpc.Client()
c.connect("tcp://127.0.0.1:4242")

currentHackathon = c.sendTestHackathon()
c.close()
'''

# print("Output from Python")
currentHackathon = json.loads(sys.argv[1])

# TODO: change this current user to logged in user
currentHacker = currentHackathon['hackers'][20];

def calculateInterestScore(hacker, carescore):
    interestsArr = hacker['interests']
    if len(interestsArr) == 0:
        return []

    newInterestArr = []

    scoresum = 0;
    for interest in interestsArr:
        scoresum = scoresum + interest[1]

    multipler = float(100)/scoresum
    caremultipler = carescore/float(10)


    for interest in interestsArr:
        score = []
        score.append(interest[0])
        score.append(round(interest[1]*multipler*caremultipler,2))
        newInterestArr.append(score)

    return newInterestArr


def calculateLanguageScore(hacker, carescore):
    languagesArr = hacker['languages']
    if len(languagesArr) == 0:
        return []

    newLanguagesArr = []

    scoresum = 0;
    for language in languagesArr:
        scoresum = scoresum + language[1]

    multipler = float(100) / scoresum
    caremultipler = carescore / float(10)

    for language in languagesArr:
        score = []
        score.append(language[0])
        score.append(round(language[1] * multipler * caremultipler, 2))
        newLanguagesArr.append(score)

    return newLanguagesArr


# TODO: not good practice to modify the parameter
def resetuser(hacker, interestcarescore, languagecarescore):
    newInterestArr = calculateInterestScore(hacker, interestcarescore)
    newLanguageArr = calculateLanguageScore(hacker, languagecarescore)
    newInterestArr.sort()
    newLanguageArr.sort()
    hacker['interests'] = newInterestArr
    hacker['languages'] = newLanguageArr


# TODO: @param filter: can be expanded to an array, along with carescores for each filter
def calculateSimiliarScore(currentHacker, compareHacker, filters):
    intsimiliar = 0
    langsimiliar = 0

    for condition in filters:
        if condition[0] == 'interests':
            thisinterest = currentHacker['interests']
            otherinterest = compareHacker['interests']
            commonelements = findcommonelements(thisinterest, otherinterest)
            intsimiliar = commonelements[len(commonelements)-1] * condition[1]


        if condition[0] == 'languages':
            thislanguage = currentHacker['languages']
            otherlanguage = compareHacker['languages']
            commonelements = findcommonelements(thislanguage, otherlanguage)
            langsimiliar = commonelements[len(commonelements)-1] * condition[1]


    # print intsimiliar+langsimiliar
    return intsimiliar+langsimiliar


def findcommonelements(arr1, arr2):
    i, j = 0, 0
    common = []
    interestsum = 0;
    while i < len(arr1) and j < len(arr2):
        if arr1[i][0] == arr2[j][0]:
            common.append(arr1[i][0])
            score = ((abs(100-(arr1[i][1]-arr2[j][1])))*float(arr1[i][1]))/float(100)
            interestsum = interestsum +score
            common.append(score)
            i += 1
            j += 1
        elif arr1[i][0] < arr2[j][0]:
            i += 1
        else:
            j += 1
    common.append(interestsum)
    return common


def hackathonsimiliarscore(currentHacker, currentHackathon, filters):
    hackathonsimiliarscores = []

    resetuser(currentHacker,filters[0][1], filters[1][1])
    hackers = currentHackathon['hackers']
    for hacker in hackers:
        resetuser(hacker, filters[0][1], filters[1][1])
        score = str(calculateSimiliarScore(currentHacker, hacker, filters))
        hackathonsimiliarscores.append([[hacker['username']], score])

    return hackathonsimiliarscores


filter = [['interests', 7],['languages', 3]]
similiarscores = hackathonsimiliarscore(currentHacker, currentHackathon, filter)
json.dumps(similiarscores)
# similiarscoresJSON = json.dumps(similiarscores)
print(similiarscores)
'''
list = [[1,2],[3,4]] # Note that the 3rd element is a tuple (3, 4)
json.dumps(list)
print(list)
'''
'''
class HelloRPC(object):
    def hello(self, name):
        return "Hello, %s" % name

s = zerorpc.Server(HelloRPC())
s.bind("tcp://0.0.0.0:4242")
s.run()
'''

'''
TODO: 
--1. Establish connection with Node.js thru childprocess
-?2. Communicate with Node.js to: a) get data of current user   b) get current hackathon selected  or  load hackathon data from node.js 
--3. Assign locally specific scores of each area for each user in current hackathon
--4. return a sorted list of users ordered by  a) interest scores  b) language scores  c) Technologies  d) Interested Fields 
--5. return a sorted list of general similiarity list based on input params such as: a) score of how much the current user cares about each field combined  
--6. format all data in JSON
7. Send the list to visualization 
'''

