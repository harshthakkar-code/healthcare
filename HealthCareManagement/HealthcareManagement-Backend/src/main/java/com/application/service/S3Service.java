package com.application.service;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import software.amazon.awssdk.auth.credentials.AwsBasicCredentials;
import software.amazon.awssdk.auth.credentials.StaticCredentialsProvider;
import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.regions.Region;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;
import software.amazon.awssdk.services.s3.model.GetUrlRequest;
import io.github.cdimascio.dotenv.Dotenv;

import java.io.IOException;
import java.util.UUID;

@Service
public class S3Service {

    private final S3Client s3;
    private final String bucketName = "varmd";  // replace with actual bucket

    public S3Service() {

         Dotenv dotenv = Dotenv.load();
        String accessKey = dotenv.get("AWS_ACCESS_KEY");
        String secretKey = dotenv.get("AWS_SECRET_KEY");
        this.s3 = S3Client.builder()
                .region(Region.EU_NORTH_1)  // Replace with your region
                .credentialsProvider(
                        StaticCredentialsProvider.create(AwsBasicCredentials.create(
                                accessKey, secretKey
                        ))
                )
                .build();
    }

 public String uploadFile(MultipartFile file, String folderName) {
    try {
        String filename = UUID.randomUUID() + "_" + file.getOriginalFilename();
        String key = folderName + "/" + filename;

        PutObjectRequest putObjectRequest = PutObjectRequest.builder()
                .bucket(bucketName)
                .key(key)
                .acl("public-read")  // Public access (optional)
                .build();

        s3.putObject(putObjectRequest, RequestBody.fromBytes(file.getBytes()));

        String fileUrl = s3.utilities()
                .getUrl(GetUrlRequest.builder().bucket(bucketName).key(key).build())
                .toExternalForm();

        System.out.println("Uploaded file URL: " + fileUrl);
        return fileUrl;

    } catch (IOException e) {
        throw new RuntimeException("Failed to upload file to S3", e);
    }
}

}
