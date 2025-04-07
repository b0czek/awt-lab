package com.dzuma.demo.services;

import java.util.List;

import com.dzuma.demo.models.Client;

public interface IClientsService {

    List<Client> getAllClients();

    Client getClientById(int id);

    Client addClient(Client client);

    Client updateClient(int id, Client updatedClient);

    boolean deleteClient(int id);
}
