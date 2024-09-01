create database gradious;

use gradious;

CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,
        username VARCHAR(255) NOT NULL UNIQUE,
email VARCHAR(255) NOT NULL UNIQUE UNIQUE,
    password VARCHAR(255) NOT NULL  
);

CREATE TABLE stores (
    id INT AUTO_INCREMENT PRIMARY KEY,
    store_name NVARCHAR(255) NOT NULL,
    location VARCHAR(255) ,
    contact_number VARCHAR(20),
   opening_time TIME ,
   closing_time TIME ,
    available_networks VARCHAR(255),
    website VARCHAR(255),
    img_url VARCHAR(1000)
);


INSERT INTO stores (store_name, location, contact_number, opening_time, closing_time, available_networks, website,img_url)
VALUES
('TechZone', '456 Tech Park, MBNR', '6756784567', '08:30:00', '17:30:00', '757 newtown,MBNR', 'www.techzone.com','https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQBMrdB6iml6iSoMKNRaOY2eqTNrUXbmvpBfA&s'),
('GroceryLand', '789 Food Ave, MBNR', '6784567890', '07:00:00', '15:00:00', '456 newtown,MBNR', 'www.groceryland.com','https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSLhiBzDAu7SifpzyHxMU9-FnRxMNTgVG-g-A&s'),
('BookNest', '321 Reading HYD, ', '9867545456', '12:00:00', '20:00:00', '678 downtown,HYD ', 'www.booknest.com','https://content3.jdmagicbox.com/comp/indore/70/0731p731stdf007670/catalogue/karishma-book-nest-opp-gk-hospital-indore-book-shops-4j0hxyq.jpg'),
('ClothCorner', '654 Fashion St, HYD', '7897567890', '07:00:00', '15:00:00', '678 newtown,HYD', 'www.clothcorner.com','https://content.jdmagicbox.com/comp/ambala/m3/9999px171.x171.150725113145.p1m3/catalogue/thukral-cloth-corner-ambala-cantt-ambala-cloth-retailers-hhivus6.jpg'),
('SuperMart', '123 Main St, HYD', '8989675678', '09:00:00', '18:00:00', '234 downtown,HYD', 'www.supermart.com','https://cdn.pixabay.com/photo/2016/03/02/20/13/grocery-1232944_640.jpg')
;