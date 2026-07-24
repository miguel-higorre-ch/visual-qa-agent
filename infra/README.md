# Infrastructure as Code

AWS infrastructure deployment scripts and configurations.

## Options

Choose one of the following deployment methods:

### 1. AWS SAM (Recommended for Lambda)

```bash
cd sam/
sam build
sam deploy --guided
```

### 2. Terraform

```bash
cd terraform/
terraform init
terraform plan
terraform apply
```

### 3. AWS CDK

```bash
cd cdk/
npm install
cdk deploy
```

### 4. Manual Setup (Quick Start)

See `manual-setup.md` for step-by-step AWS Console instructions.

## Resources Created

- **S3 Bucket** — visual-qa-agent-images (with baseline/ and current/ prefixes)
- **Lambda Function** — visual-qa-agent-analyzer
- **API Gateway** — REST API with /analyze endpoint
- **IAM Roles** — Lambda execution role with S3 and Bedrock permissions
- **CloudWatch Logs** — Lambda function logs

## Cost Estimate

- S3: ~$0.023/GB storage + data transfer
- Lambda: Free tier 1M requests/month, then $0.20 per 1M
- Bedrock: Claude 3 Sonnet pricing per token
- API Gateway: Free tier 1M requests/month, then $3.50 per 1M

Estimated monthly cost for development: **< $5**

## Configuration

Copy environment template:
```bash
cp terraform.tfvars.example terraform.tfvars
# Edit with your values
```

## Cleanup

```bash
# SAM
sam delete

# Terraform
terraform destroy

# CDK
cdk destroy
```
