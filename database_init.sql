-- Create the database
CREATE DATABASE finInstitution;

-- Connect to the newly created database
\c finInstitution

-- Create the tables

CREATE TABLE loancurrentstate (
    stateid SERIAL PRIMARY KEY,
    ispaid BOOLEAN,
    installmentspaid INTEGER
);

CREATE TABLE loans (
    userid INTEGER,
    stateid INTEGER,
    loanid SERIAL PRIMARY KEY
);

CREATE TABLE loantype (
    loantypeid SERIAL PRIMARY KEY,
    loanid INTEGER,
    system VARCHAR(50),
    currency VARCHAR(50),
    capital MONEY,
    interest MONEY,
    duration INTEGER
);

CREATE TABLE users (
    username VARCHAR(50),
    salary MONEY,
    password VARCHAR(255),
    userid SERIAL PRIMARY KEY
);

-- Create sequences

CREATE SEQUENCE loans_loanid_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

CREATE SEQUENCE loantype_loantypeid_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

CREATE SEQUENCE users_temp_userid_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
    