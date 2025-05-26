# Core System Class Diagram

This class diagram describes the structure of key entities within the system and their relationships.

```mermaid
classDiagram
    class User {
        +String userId
        +String email
        +String passwordHash
        +DateTime createdAt
        +DateTime lastLogin
        +List~Role~ roles
    }

    class Product {
        +String productId
        +String name
        +String description
        +Double price
        +Int stock
        +List~Category~ categories
    }

    class Order {
        +String orderId
        +String userId
        +DateTime orderDate
        +Double totalAmount
        +String status
    }

    class OrderItem {
        +String orderItemId
        +String orderId
        +String productId
        +Int quantity
        +Double unitPrice
    }

    User "1" -- "*" Order : places
    Order "1" -- "*" OrderItem : contains
    Product "1" -- "*" OrderItem : included in
    Category "1" -- "*" Product : categorizes
