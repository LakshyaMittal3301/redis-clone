# Specify server details
$serverAddress = "localhost"
$serverPort = 6379

# Define the command string to be sent
$commandString = "*1\r\n$4\r\nping\r\n"

# Create a TCP client
$client = New-Object System.Net.Sockets.TcpClient
$client.Connect($serverAddress, $serverPort)
$stream = $client.GetStream()

# Convert the command string to bytes and send it to the server
$commandBytes = [System.Text.Encoding]::ASCII.GetBytes($commandString)
$stream.Write($commandBytes, 0, $commandBytes.Length)

# Receive the response from the server
$responseBytes = New-Object byte[] 4096
$bytesRead = $stream.Read($responseBytes, 0, $responseBytes.Length)
$response = [System.Text.Encoding]::ASCII.GetString($responseBytes, 0, $bytesRead)

# Print the response on the screen
Write-Host "Response from server: $response"

# Close the client
$client.Close()
