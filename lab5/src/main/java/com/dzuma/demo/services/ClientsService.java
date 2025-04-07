package com.dzuma.demo.services;

import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Service;

import com.dzuma.demo.models.Client;

@Service
public class ClientsService implements IClientsService {

    private final List<Client> clientsRepo = new ArrayList<>();

    public ClientsService() {
        clientsRepo.add(new Client(1, "John Doe"));
        clientsRepo.add(new Client(2, "Jane Smith"));
        clientsRepo.add(new Client(3, "Alice Johnson"));
    }

    @Override
    public List<Client> getAllClients() {
        return new ArrayList<>(clientsRepo);
    }

    @Override
    public Client getClientById(int id) {
        return clientsRepo.stream().filter(client -> client.getId() == id).findFirst().orElse(null);
    }

    @Override
    public Client addClient(Client client) {
        clientsRepo.add(client);
        return client;
    }

    @Override
    public Client updateClient(int id, Client updatedClient) {
        for (int i = 0; i < clientsRepo.size(); i++) {
            if (clientsRepo.get(i).getId() == id) {
                updatedClient.setId(id);
                clientsRepo.set(i, updatedClient);
                return updatedClient;
            }
        }
        return null;
    }

    @Override
    public boolean deleteClient(int id) {
        return clientsRepo.removeIf(client -> client.getId() == id);
    }
}
