CREATE DATABASE IF NOT EXISTS sabordigital;
USE sabordigital;

-- Criação da tabela produto
CREATE TABLE IF NOT EXISTS produto (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    descricao TEXT NOT NULL,
    preco DECIMAL(10, 2) NOT NULL,
    disponivel BOOLEAN NOT NULL
);

INSERT INTO produto (nome, descricao, preco, disponivel)
VALUES 
('Espaguete à Carbonara', 'O melhor espaguete que você irá comer, com massa feita diretamente da Itália', 23.89, true),
('Brownie com Sorvete', 'Uma explosão de sabores, totalmente irresistível', 17.88, true),
('Nhoque ao Pesto', 'Feito com molho especial', 28.21, true);

SELECT * FROM produto;
