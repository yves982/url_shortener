# url-shortener
URL shortening service.

## Technologies
In this project I'll use:
- NodeJs (runtime environment)
- TypeScript (compite time) / JavaScript (runtime)
- Express (web framework)
- Jest (unit tests)
- Yarn (package manager)

## Development methodology
I'll build this project using TDD around the use cases.

## Use cases
### Shorten an URL
As a user i want to be able to retrieve a shortened url for any valid URL i submit.

Example:
POST à [projectUrl]/api/shorturl/ { "url": "www.lunii.com" }
should answer with 
```language=javascript
{"originalUrl" : "www.lunii.com", "shortUrl":"4hxNeK"}
```

### Redirect to the original URL
As a user i want to be able to visit a shortened URL and to land on the original URL.

Example:
GET [projectUrl]/api/shorturl/4hxNeK
should redirect me to www.lunii.com

### See service usage statistic
As a user i want to consult service usage statistics (including the number of URL visits for every registered URL).

Example:
GET [projectUrl]/api/shorturl/analytics
should answer with 
```language=javascript
[
    {"originalUrl": " "www.lunii.com", "shortUrl":"4hxNeK", "nbClicks": 3}
]
```
