# CloudPipe Static Website CI/CD Pipeline

This project demonstrates how to build a secure static website deployment pipeline using AWS S3, CloudFront, CloudFormation, IAM OIDC, and GitHub Actions.

The goal of the project is to help a small web development company automate website deployments. Instead of manually uploading website files to a production server, developers can push changes to GitHub and let GitHub Actions deploy the latest version automatically.

## Project Overview

CloudPipe is a small web development company that builds websites for local businesses. Their current deployment process is manual, time-consuming, and prone to errors.

This project solves that problem by creating a basic CI/CD pipeline that:

- Deploys website files automatically when code is pushed to GitHub
- Stores static website files in an S3 bucket
- Delivers the website through CloudFront
- Uses CloudFormation to provision AWS infrastructure
- Uses GitHub Actions with OIDC to authenticate securely to AWS
- Invalidates the CloudFront cache after each deployment

## Architecture

Developer
   ↓
GitHub Repository
   ↓
GitHub Actions Workflow
   ↓
AWS IAM Role using OIDC
   ↓
S3 Bucket
   ↓
CloudFront Distribution
   ↓
End Users
```

Users access the website through CloudFront. The S3 bucket remains private and is used as the origin for the static website files.

## AWS Services Used

- **Amazon S3** — stores the static website files
- **Amazon CloudFront** — delivers the website through a CDN
- **AWS CloudFormation** — provisions infrastructure as code
- **AWS IAM** — manages permissions for deployment
- **OIDC** — allows GitHub Actions to securely assume an AWS IAM role
- **GitHub Actions** — automates the deployment workflow

## Project Structure

```text
cloudpipe-static-site-cicd/
├── .github/
│   └── workflows/
│       └── deploy.yaml
├── infrastructure/
│   └── template.yaml
├── website/
│   ├── index.html
│   ├── css/
│   │   └── style.css
│   └── js/
│       └── script.js
└── README.md
```

## How the Deployment Works

1. A developer updates the website files locally.
2. The changes are committed and pushed to the `main` branch.
3. GitHub Actions automatically starts the deployment workflow.
4. GitHub Actions authenticates to AWS using OIDC.
5. The workflow syncs the `website/` folder to the S3 bucket.
6. The workflow invalidates the CloudFront cache.
7. Users can access the updated website through the CloudFront URL.

## GitHub Actions Workflow

The deployment workflow is located at:

.github/workflows/deploy.yml
```

The workflow performs the following steps:

```yaml
name: Deploy Website

on:
  push:
    branches:
      - main

permissions:
  id-token: write
  contents: read
```

The workflow uses OIDC to assume an AWS IAM role instead of using long-term AWS access keys.

## Deployment Command

The website files are deployed to S3 using:

```bash
aws s3 sync website/ s3://cloudpipe-deploy-443245369180-us-east-1 --delete
```

The `--delete` flag makes sure the S3 bucket matches the local `website/` folder by removing files from the bucket that no longer exist locally.

## CloudFront Cache Invalidation

After deploying new files to S3, the workflow invalidates the CloudFront cache:

```bash
aws cloudfront create-invalidation \
  --distribution-id YOUR_DISTRIBUTION_ID \
  --paths "/*"
```

This makes sure users receive the latest version of the website.

## Validation

To validate the pipeline, I made a small change to the website and pushed the update to GitHub.

After the push, I confirmed that:

- The GitHub Actions workflow started automatically
- The workflow completed successfully
- The updated files were synced to S3
- The CloudFront cache was invalidated
- The updated website was available through the CloudFront URL

## Key Lessons Learned

Through this project, I learned how to:

- Use CloudFormation to create AWS infrastructure
- Configure an S3 bucket for a secure static website deployment
- Use CloudFront as the public entry point for a private S3 bucket
- Use GitHub Actions to automate deployment
- Use OIDC instead of long-term AWS access keys
- Validate a CI/CD pipeline from code push to live website update

## Future Improvements

Possible improvements for this project include:

- Adding custom domain support with Route 53
- Adding HTTPS certificate management with AWS Certificate Manager
- Adding automated testing before deployment
- Adding separate dev and production environments
- Adding deployment notifications

## Conclusion

This project demonstrates how a small company can modernize its website deployment process using AWS and GitHub Actions.

Instead of manually uploading files, developers can push changes to GitHub and rely on an automated CI/CD pipeline to deploy the website securely and consistently.