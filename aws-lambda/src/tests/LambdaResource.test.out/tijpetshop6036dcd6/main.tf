provider "aws" {
  assume_role = {
    role_arn = "arn:aws:iam::13371337:role/DeploymentRole"
  }

  region = "eu-north-1"
}

terraform {
  backend "s3" {
    bucket = "some-backend-bucket"
    key    = "tijpetshop6036dcd6.terraform.tfstate"
    region = "eu-north-1"
  }
}

resource "aws_iam_role" "petLambdas" {
  assume_role_policy = <<EOF
{"Version":"2012-10-17","Statement":[{"Action":"sts:AssumeRole","Principal":{"Service":"lambda.amazonaws.com"},"Effect":"Allow","Sid":""}]}
EOF
}

output "tfinjs_arn" {
  value = "${aws_iam_role.petLambdas.arn}"
}
