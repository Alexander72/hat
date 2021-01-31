// enter the container, open mongo cli using auth creds from docker-compose.tml, then:
use hat;
db.createUser({user:"hat",pwd:"1234",roles:[{role:"readWrite",db:"hat"}]})